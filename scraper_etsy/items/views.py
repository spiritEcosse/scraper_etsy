from rest_framework import viewsets

from scraper_etsy.items.models import Request
from scraper_etsy.items.serializer import RequestSerializer
from scraper_etsy.items.tasks import search


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()
    url = "https://www.etsy.com/search?q={}"

    def perform_create(self, serializer):
        super(RequestViewSet, self).perform_create(serializer)
        serializer.instance.url = self.url.format(serializer.instance.search)
        serializer.instance.save()
        search.delay(serializer.instance.id)
