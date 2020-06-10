from rest_framework.generics import CreateAPIView, ListAPIView

from scraper_etsy.items.models import Request
from scraper_etsy.items.serializer import RequestSerializer
from scraper_etsy.items.tasks import run_crawler


class RequestCreateView(CreateAPIView):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()
    url = "https://www.etsy.com/search?q={}"

    def perform_create(self, serializer):
        super(RequestCreateView, self).perform_create(serializer)
        run_crawler.delay(self.url.format(serializer.instance.search))


class RequestDetailView(ListAPIView):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()
