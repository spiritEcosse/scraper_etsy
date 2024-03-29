import asyncio
import datetime
import json
import re

import aiohttp
import async_timeout
import us
from redis import StrictRedis
from bs4 import BeautifulSoup
from django.conf import settings
from django_countries import countries

from scraper_etsy.items.models import Request, Item, Shop

redis_connection = StrictRedis.from_url(settings.REDIS_URL)


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

    @staticmethod
    async def request_set_status(request):
        request.says_done()

    async def get_response(self, request, session):
        async with async_timeout.timeout(5000):
            async with session.get(request.url) as response:
                request.code = response.status
                await self.request_set_status(request)
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

    @staticmethod
    async def request_set_status(request):
        pass

    async def post_request(self, request, response):
        soup = await super(RequestParser, self).post_request(request, response)
        tags_a = soup.select(self.xpath)[self.offset:self.offset + self.limit]

        for tag_a in tags_a:
            url = tag_a["href"].split("?")[0]

            if redis_connection.sadd(request.id, url):
                self.children.append(
                    Request(url=url, parent=request, level=request.level + 1)
                )


class ItemsParser(Parser):
    xpath_h1 = "h1[data-buy-box-listing-title]"
    xpath_tags = 'div[id="wt-content-toggle-tags-read-more"] a'
    xpath_shop = 'a[href^="https://www.etsy.com/shop/"]'

    def __init__(self, request, limit, offset):
        super(ItemsParser, self).__init__(request, limit, offset)
        self.requests = self.request.children.all()[self.offset:self.limit]
        self.shop_requests = []

    async def post_request(self, request, response):
        soup = await super(ItemsParser, self).post_request(request, response)

        tags = set()

        for tag_a in soup.select(self.xpath_tags):
            tag = tag_a.string.strip()

            if len(tag.split()) >= 2:
                tags.add(tag)

        if len(tags) > request.parent.filter.count_tags:
            data_item = {
                "h1": soup.select_one(self.xpath_h1).string.strip(),
                "request_id": request.id
            }
            redis_connection.hset("items", request.id, json.dumps(data_item))
            redis_connection.hset(
                "tags", request.id, json.dumps([{"name": tag} for tag in tags])
            )
            self.shop_requests.append(
                Request(
                    url=soup.select_one(self.xpath_shop)["href"].split("?")[0],
                    parent=request, level=request.level + 1
                )
            )


class ShopsParser(Parser):
    xpath_title = "div[class~='shop-name-and-title-container'] h1"
    xpath_year_store_base = "span[class~='etsy-since']"
    xpath_sales = 'div[class~="shop-info"]'
    xpath_location = 'span[data-key="user_location"]'

    def __init__(self, request, limit=0, offset=0):
        super(ShopsParser, self).__init__(request, limit, offset)
        self.requests = Request.objects.filter(
            level=2, parent__parent=self.request
        ).select_related("parent__parent__filter")[self.offset:self.offset + self.limit]
        self.shops = []
        self.shops_title = []
        self.items = []

    @staticmethod
    def find_location(location):
        location = "".join(location.split("."))
        find = us.states.lookup(location) and "US"

        if not find:
            for abbr, country in dict(countries).items():
                if location in country:
                    find = abbr
        return find

    async def post_request(self, request, response):
        soup = await super(ShopsParser, self).post_request(request, response)

        sales = soup.select_one(self.xpath_sales).find(string=re.compile("Sales")) or 0
        if sales:
            sales = sales.split("Sales")[0].strip()
            sales = int("".join(sales.split(",")))

        matchers = [
            sales >= request.parent.parent.filter.sales,
        ]

        year_store_base = soup.select_one(self.xpath_year_store_base)
        if year_store_base:
            year_store_base = int(year_store_base.string.split("since")[-1].strip())
            matchers.append(year_store_base >= request.parent.parent.filter.year_store_base)

        location = soup.select_one(self.xpath_location)

        if location:
            location = self.find_location(location.string.split(",")[-1].strip())

        if request.parent.parent.filter.countries:
            matchers.append(location in request.parent.parent.filter.countries)

        if all(matchers):
            title = soup.select_one(self.xpath_title).string.strip()
            self.shops_title.append(title)

            if redis_connection.sadd("shops", title):
                self.shops.append(
                    Shop(
                        title=title,
                        year_store_base=datetime.date(year_store_base, 1, 1) if year_store_base else None,
                        sales=sales,
                        location=location,
                        url=request.url,
                    )
                )
            self.items.append(
                Item(**json.loads(redis_connection.hget("items", request.parent.id)))
            )
