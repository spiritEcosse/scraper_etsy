import asyncio
from urllib.parse import urlparse

import aiohttp
import async_timeout
from bs4 import BeautifulSoup
from django.db import transaction

from config import celery_app
from scraper_etsy.items.models import Request, Item, Tag


@celery_app.task()
def search(request_id):
    request = Request.objects.get(id=request_id)
    parser = RequestParser(request)
    parser.run()
    Request.objects.bulk_update(parser.requests, ["status", "code"])
    Request.objects.bulk_create(parser.children)

    with transaction.atomic(using=None):
        Request.objects.rebuild()

    request = Request.objects.get(id=request_id)
    parser = ItemsParser(request)
    parser.run()
    Request.objects.bulk_update(parser.requests, ["status", "code"])
    items = Item.objects.bulk_create(parser.items)

    tags = []
    for index, tags_ in enumerate(parser.tags):
        for tag in tags_:
            setattr(tag, "item", items[index])
            tags.append(tag)

    Tag.objects.bulk_create(tags)


class Parser:
    def __init__(self, request):
        self.request = request
        self.requests = ()

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

    def __init__(self, request):
        super(RequestParser, self).__init__(request)
        self.requests = (self.request, )
        self.children = ()

    async def post_request(self, request, response):
        soup = await super(RequestParser, self).post_request(request, response)
        urls = set()
        tag_a = iter(soup.select(self.xpath))

        while len(urls) < 5:
            parsed_url = urlparse(next(tag_a)["href"])
            url = parsed_url.scheme + "://" + parsed_url.hostname + parsed_url.path
            urls.add(url)

        self.children = (
            Request(
                url=url, parent=request, lft=1, rght=1, tree_id=request.tree_id,
                level=request.level + 1
            ) for url in urls
        )


class ItemsParser(Parser):
    xpath_h1 = "h1[data-buy-box-listing-title]"
    xpath_tags = 'div[id="wt-content-toggle-tags-read-more"] a'

    def __init__(self, request):
        super(ItemsParser, self).__init__(request)
        self.requests = self.request.get_children()
        self.items = []
        self.tags = []

    async def post_request(self, request, response):
        soup = await super(ItemsParser, self).post_request(request, response)

        item = Item(title=soup.title.string, h1=soup.select_one(self.xpath_h1).string.strip(), request=request)
        self.items.append(item)
        self.tags.append([Tag(name=tag_a.string.strip()) for tag_a in soup.select(self.xpath_tags)])
