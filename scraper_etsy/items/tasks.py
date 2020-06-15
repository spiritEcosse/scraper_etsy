from celery.utils.log import get_task_logger
from django.conf import settings
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from urllib.parse import urlparse
from config import celery_app
from scraper_etsy.items.models import Request
import json
logger = get_task_logger(__name__)


def get_webdriver():
    return webdriver.Remote(
        command_executor=settings.REMOTE_DRIVER,
        desired_capabilities=DesiredCapabilities.PHANTOMJS,
    )


@celery_app.task()
def run_crawler(url, request_id):
    driver = get_webdriver()
    driver.get(url)

    request = Request.objects.get(id=request_id)
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

    Request.objects.bulk_create((Request(url=url, parent=request) for url in urls))
    driver.quit()
