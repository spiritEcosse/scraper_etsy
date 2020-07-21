import json

from aiohttp.client_exceptions import ClientConnectionError
from django.conf import settings
from django.db.models import Prefetch
from django.db.utils import IntegrityError
from django.db.utils import OperationalError
from redis import from_url

from config import celery_app
from scraper_etsy.items.models import Request, Item, Tag, Shop
from .parsers import RequestParser, ShopsParser, ItemsParser

redis_connection = from_url(settings.REDIS_URL)


@celery_app.task(
    bind=True,
    autoretry_for=(ClientConnectionError, OperationalError, IntegrityError, ),
    retry_kwargs={"max_retries": settings.MAX_RETRIES}
)
def search(self, request_id, limit=None, offset=0):
    request = Request.objects.select_related("filter").prefetch_related(
        Prefetch(
            "children",
            queryset=Request.objects.select_related("parent__filter"),
        )
    ).get(id=request_id)

    if limit is None:
        limit = request.filter.limit

    parser_request = RequestParser(request, limit=limit, offset=offset)
    parser_request.run()

    Request.objects.bulk_update(parser_request.requests, ["status", "code"])
    Request.objects.bulk_create(parser_request.children)

    request.refresh_from_db()
    parser = ItemsParser(request, limit=len(parser_request.children), offset=0)
    parser.run()

    Request.objects.bulk_update(parser.requests, ["status", "code"])
    Request.objects.bulk_create(parser.shop_requests)

    if parser.shop_requests:
        request_shop.delay(request_id, limit, len(parser.shop_requests), offset + limit)
    elif limit + offset <= settings.MAX_ON_PAGE:
        next_limit = limit - len(parser.shop_requests)
        if next_limit:
            self.retry(
                countdown=settings.COUNTDOWN,
                max_retries=settings.MAX_RETRIES,
                kwargs={
                    "limit": next_limit,
                    "offset": limit + offset,
                }
            )
        else:
            request.says_done()
            request.save()
    else:
        request.says_done()
        request.save()


@celery_app.task(
    autoretry_for=(ClientConnectionError, OperationalError, IntegrityError, ),
    retry_kwargs={"max_retries": settings.MAX_RETRIES}
)
def request_shop(request_id, limit, limit_q, offset):
    request = Request.objects.get(id=request_id)
    parser = ShopsParser(request, limit_q)
    parser.run()
    Request.objects.bulk_update(parser.requests, ["status", "code"])
    shops = Shop.objects.bulk_create(parser.shops)

    for shop in shops:
        redis_connection.hset("shops_", shop.title, shop.id)  # WARNING : Does redis have data after restart ?

    next_limit = limit - len(parser.items)
    if next_limit and offset < settings.MAX_ON_PAGE:
        search.delay(
            request_id,
            limit=next_limit,
            offset=offset
        )
    else:
        request.says_done()
        request.save()

    for index, item in enumerate(parser.items):
        item.shop_id = redis_connection.hget("shops_", parser.shops_title[index])

    tags = []
    for item in Item.objects.bulk_create(parser.items):
        tags_ = json.loads(redis_connection.hget("tags", item.request_id))

        for tag in tags_:
            tag = Tag(**tag)
            tag.item = item
            tags.append(tag)

    Tag.objects.bulk_create(tags)
