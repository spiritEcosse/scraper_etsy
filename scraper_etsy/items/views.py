from rest_framework import viewsets

from scraper_etsy.items.models import Request
from scraper_etsy.items.serializer import RequestSerializer
from scraper_etsy.items.tasks import search


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()
    url = "https://www.etsy.com/search?q={}"

    def perform_create(self, serializer):
        serializer.validated_data.update({'url': self.url.format(serializer.validated_data['search'])})
        super(RequestViewSet, self).perform_create(serializer)
        search.delay(serializer.instance.id)
