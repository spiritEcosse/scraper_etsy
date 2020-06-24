import asyncio
import datetime
import aiohttp
import async_timeout
from bs4 import BeautifulSoup
from django.conf import settings
from django.db import transaction
from redis import from_url

from config import celery_app
from scraper_etsy.items.models import Request, Item, Tag, Shop
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

redis_connection = from_url(settings.REDIS_URL)


@celery_app.task(bind=True)
def search(self, request_id, limit=settings.LIMIT, offset=0):
    logger.info(">>>>>>>> {}:{}".format(limit, offset))

    request = Request.objects.get(id=request_id)
    parser_request = RequestParser(request, limit=limit, offset=offset)
    parser_request.run()
    Request.objects.bulk_update(parser_request.requests, ["status", "code"])
    Request.objects.bulk_create(parser_request.children)

    with transaction.atomic(using=None):
        Request.objects.partial_rebuild(request.tree_id)

    request = Request.objects.get(id=request_id)
    parser = ItemsParser(request, limit=len(parser_request.children), offset=0)
    parser.run()

    Request.objects.bulk_update(parser.requests, ["status", "code"])
    Request.objects.bulk_create(parser.shop_requests)

    with transaction.atomic(using=None):
        Request.objects.partial_rebuild(request.tree_id)

    items = Item.objects.bulk_create(parser.items)
    request_shop.delay(request_id)

    tags = []
    for index, tags_ in enumerate(parser.tags):
        for tag in tags_:
            setattr(tag, "item", items[index])
            tags.append(tag)

    Tag.objects.bulk_create(tags)

    next_limit = limit - len(parser.items)
    if next_limit:
        self.retry(
            countdown=settings.COUNTDOWN,
            max_retries=settings.MAX_RETRIES,
            kwargs={
                "limit": next_limit,
                "offset": limit + offset,
            }
        )


@celery_app.task()
def request_shop(request_id):
    request = Request.objects.get(id=request_id)
    parser = ShopsParser(request)
    parser.run()
    Request.objects.bulk_update(parser.requests, ["status", "code"])
    shops = Shop.objects.bulk_create(parser.shops)

    items = []
    for index, request in enumerate(parser.requests):
        item = request.parent.item
        item.shop = shops[index]
        items.append(item)

    Item.objects.bulk_update(items, ["shop_id"])


class Parser:
    def __init__(self, request, limit, offset):
        self.request = request
        self.requests = ()
        self.limit = limit
        self.offset = offset

    def run(self):
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(self.gather_tasks())

    async def post_request(self, request, response):
        return BeautifulSoup(await response.text(), 'html.parser')

    async def get_response(self, request, session):
        async with async_timeout.timeout(120):
            async with session.get(request.url) as response:
                request.code = response.status
                request.says_done()
                await self.post_request(request, response)

    async def gather_tasks(self):
        async with aiohttp.ClientSession() as session:
            tasks = (self.get_response(request, session) for request in self.requests)
            return await asyncio.gather(*tasks)


class RequestParser(Parser):
    xpath = "div[data-search-results] ul li a"

    def __init__(self, request, limit, offset):
        super(RequestParser, self).__init__(request, limit, offset)
        self.requests = (self.request, )
        self.children = ()

    async def post_request(self, request, response):
        soup = await super(RequestParser, self).post_request(request, response)
        logger.info("================= data-search-results \n \n {}".format(
            "\n".join([tag_a["href"] for tag_a in soup.select(self.xpath)[self.offset:self.offset + self.limit]]))
        )
        tags_a = soup.select(self.xpath)[self.offset:self.offset + self.limit]
        urls = set()

        for tag_a in tags_a:
            url = tag_a["href"].split("?")[0]

            if redis_connection.sadd(request.get_root().id, url):
                urls.add(url)

        self.children = [
            Request(
                url=url, parent=request, lft=1, rght=1, tree_id=request.tree_id,
                level=request.level + 1
            ) for url in urls
        ]


class ItemsParser(Parser):
    xpath_h1 = "h1[data-buy-box-listing-title]"
    xpath_tags = 'div[id="wt-content-toggle-tags-read-more"] a'
    xpath_shop = 'a[href^="https://www.etsy.com/shop/"]'

    def __init__(self, request, limit, offset):
        super(ItemsParser, self).__init__(request, limit, offset)
        self.requests = self.request.get_children()[self.offset:self.limit]

        self.items = []
        self.tags = []
        self.shop_requests = []

    async def post_request(self, request, response):
        soup = await super(ItemsParser, self).post_request(request, response)

        tags = soup.select(self.xpath_tags)
        if len(tags) > settings.COUNT_TAGS:
            self.items.append(Item(h1=soup.select_one(self.xpath_h1).string.strip(), request=request))
            self.shop_requests.append(
                Request(
                    url=soup.select_one(self.xpath_shop)["href"], parent=request, lft=1, rght=1, tree_id=request.tree_id,
                    level=request.level + 1
                )
            )
            self.tags.append([Tag(name=tag_a.string.strip()) for tag_a in tags])


class ShopsParser(Parser):
    xpath_title = "div[class~='shop-name-and-title-container'] h1"
    xpath_started_at = "span[class~='etsy-since']"
    xpath_sales = 'a[href^="https://www.etsy.com/shop/"]'

    def __init__(self, request, limit=0, offset=0):
        super(ShopsParser, self).__init__(request, limit, offset)
        self.requests = self.request.get_descendants_by_level(2)
        self.shops = []

    async def post_request(self, request, response):
        soup = await super(ShopsParser, self).post_request(request, response)

        started_at = soup.select_one(self.xpath_started_at).string.split("since")[-1].strip()
        sales = soup.select_one(self.xpath_sales).string.split("Sales")[0].strip()

        self.shops.append(
            Shop(
                title=soup.select_one(self.xpath_title).string.strip(),
                started_at=datetime.date(int(started_at), 1, 1),
                sales="".join(sales.split(",")),
                request=request
            )
        )
