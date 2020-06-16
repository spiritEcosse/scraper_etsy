import json
from urllib.parse import urlparse
# import asyncio

from celery.utils.log import get_task_logger
from django.conf import settings
from django.db import transaction
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from config import celery_app
from scraper_etsy.items.models import Request, Item, Tag


logger = get_task_logger(__name__)


def get_webdriver():
    return webdriver.Remote(
        command_executor=settings.REMOTE_DRIVER,
        desired_capabilities=DesiredCapabilities.PHANTOMJS,
    )


@celery_app.task()
def run_crawler(request_id):
    request = Request.objects.get(id=request_id)
    driver = get_webdriver()
    driver.get(request.url)

    request.says_done()
    har = json.loads(driver.get_log('har')[0]['message'])
    request.code = har['log']['entries'][0]['response']['status']
    request.save()

    urls = set()
    xpath = "//a[contains(@class, 'display-inline-block listing-link')]"
    tag_a = iter(driver.find_elements_by_xpath(xpath))

    while len(urls) < 5:
        parsed_url = urlparse(next(tag_a).get_attribute("href"))
        url = parsed_url.scheme + "://" + parsed_url.hostname + parsed_url.path
        urls.add(url)

    Request.objects.bulk_create(
        (Request(
            url=url, parent=request, lft=1, rght=1, tree_id=request.tree_id,
            level=request.level + 1
        ) for url in urls)
    )
    with transaction.atomic(using=None):
        Request.objects.rebuild()
    driver.quit()


# @celery_app.task()
# def requests_depth_2(request_id):
#     request = Request.objects.get(id=request_id)
#
#     urls = ["https://www.python.org/events/python-events/801/",
#             "https://www.python.org/events/python-events/790/",
#             "https://www.python.org/events/python-user-group/816/",
#             "https://www.python.org/events/python-events/757/"]
#
#     loop = asyncio.get_event_loop()
#     results = loop.run_until_complete(main(urls))
#
#     requests = request.get_children()
#     for request_child in requests:
#         get_item_tag(request_child.url)

    # Request.objects.bulk_update(requests, ["status", "code"])
    # Item.objects.bulk_create((Item(title=, h1=, request=) for in ))
    # Tag.objects.bulk_create((Tag(name=, item=) for in ))


# async def get_item_tag(url):
#     driver = get_webdriver()
#     driver.get(url)
#
#
# async def main(urls):
#     tasks = [get_item_tag(url) for url in urls]
#     return await asyncio.gather(*tasks)
#
