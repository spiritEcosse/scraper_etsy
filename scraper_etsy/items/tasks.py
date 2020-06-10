from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from config import celery_app


@celery_app.task()
def run_crawler(url):
    process = CrawlerProcess(get_project_settings())
    # 'followall' is the name of one of the spiders of the project.
    process.crawl('followall', domain=url)
    process.start()  # the script will block here until the crawling is finished
