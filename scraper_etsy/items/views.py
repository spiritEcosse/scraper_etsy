from rest_framework import viewsets

from scraper_etsy.items.models import Request
from scraper_etsy.items.serializer import RequestSerializer
from scraper_etsy.items.tasks import run_crawler


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()
    url = "https://www.etsy.com/search?q={}"

    def perform_create(self, serializer):
        super(RequestViewSet, self).perform_create(serializer)
        run_crawler.delay(self.url.format(serializer.instance.search), serializer.instance.id)
