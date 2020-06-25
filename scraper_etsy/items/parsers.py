import asyncio
import datetime
import json
import re

import aiohttp
import async_timeout
import us
from bs4 import BeautifulSoup
from django.conf import settings
from django_countries import countries
from redis import from_url

from scraper_etsy.items.models import Request, Item, Shop

redis_connection = from_url(settings.REDIS_URL)


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
        async with async_timeout.timeout(500):
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
        self.children = []

    async def post_request(self, request, response):
        soup = await super(RequestParser, self).post_request(request, response)
        tags_a = soup.select(self.xpath)[self.offset:self.offset + self.limit]

        for tag_a in tags_a:
            url = tag_a["href"].split("?")[0]

            if redis_connection.sadd(request.get_root().id, url):
                self.children.append(
                    Request(
                        url=url, parent=request, lft=1, rght=1, tree_id=request.tree_id,
                        level=request.level + 1
                    )
                )


class ItemsParser(Parser):
    xpath_h1 = "h1[data-buy-box-listing-title]"
    xpath_tags = 'div[id="wt-content-toggle-tags-read-more"] a'
    xpath_shop = 'a[href^="https://www.etsy.com/shop/"]'

    def __init__(self, request, limit, offset):
        super(ItemsParser, self).__init__(request, limit, offset)
        self.requests = self.request.get_children()[self.offset:self.limit]
        self.shop_requests = []

    async def post_request(self, request, response):
        soup = await super(ItemsParser, self).post_request(request, response)

        tags = soup.select(self.xpath_tags)
        if len(tags) > settings.COUNT_TAGS:
            data_item = {
                "h1": soup.select_one(self.xpath_h1).string.strip(),
                "request_id": request.id
            }
            redis_connection.hset("items", request.id, json.dumps(data_item))
            redis_connection.hset(
                "tags", request.id, json.dumps([{"name": tag_a.string.strip()} for tag_a in tags])
            )
            self.shop_requests.append(
                Request(
                    url=soup.select_one(self.xpath_shop)["href"],
                    parent=request, lft=1, rght=1, tree_id=request.tree_id, level=request.level + 1
                )
            )


class ShopsParser(Parser):
    xpath_title = "div[class~='shop-name-and-title-container'] h1"
    xpath_started_at = "span[class~='etsy-since']"
    xpath_sales = 'div[class~="shop-info"]'
    xpath_location = 'span[data-key="user_location"]'

    def __init__(self, request, limit=0, offset=0):
        super(ShopsParser, self).__init__(request, limit, offset)
        self.requests = self.request.get_descendants_by_level(2)\
                            .select_related("parent")[self.offset:self.offset + self.limit]
        self.shops = []
        self.shops_title = []
        self.items = []

    @staticmethod
    def find_location(location):
        find = us.states.lookup(location) and "US"

        if not find:
            for abbr, country in dict(countries).items():
                if location in country:
                    find = abbr
        return find

    async def post_request(self, request, response):
        soup = await super(ShopsParser, self).post_request(request, response)

        started_at = int(soup.select_one(self.xpath_started_at).string.split("since")[-1].strip())
        sales = soup.select_one(self.xpath_sales).find(string=re.compile("Sales")) or 0
        if sales:
            sales = sales.split("Sales")[0].strip()
            sales = int("".join(sales.split(",")))

        location = soup.select_one(self.xpath_location)

        if location:
            location = self.find_location(location.string.split(",")[-1].strip())

        if all([sales >= settings.SALES, started_at >= settings.STARTED_AT, location in settings.COUNTRIES]):
            title = soup.select_one(self.xpath_title).string.strip()
            self.shops_title.append(title)
            if not redis_connection.hget("shops", title):
                self.shops.append(
                    Shop(
                        title=title,
                        started_at=datetime.date(started_at, 1, 1),
                        sales=sales,
                        request=request,
                        location=location
                    )
                )
            self.items.append(
                Item(**json.loads(redis_connection.hget("items", request.parent.id)))
            )
