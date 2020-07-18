from django.conf import settings
from django.db.models import Prefetch
from django_countries import countries
from rest_framework import viewsets
from rest_framework.response import Response

from scraper_etsy.items.models import Request
from scraper_etsy.items.serializer import RequestSerializer, CountriesSerializer
from scraper_etsy.items.tasks import search


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.filter(level=0).prefetch_related(
        Prefetch(
            "children",
            queryset=Request.objects.select_related(
                "item__shop__request"
            ).exclude(item__isnull=True),
            to_attr="children_have_item"
        ),
        "children_have_item__item__tags"
    ).select_related("filter")
    url = "https://www.etsy.com/search?q={}"

    def perform_create(self, serializer):
        serializer.validated_data.update({'url': self.url.format(serializer.validated_data['search'])})
        super(RequestViewSet, self).perform_create(serializer)
        search.delay(serializer.instance.id)


class FilterView(viewsets.views.APIView):
    @staticmethod
    def get(request):
        data = {
            "filter": {
                'countries':
                    [country.name for country in countries if country.code in settings.COUNTRIES],
                'limit': settings.LIMIT,
                'count_tags': settings.COUNT_TAGS,
                'sales': settings.SALES,
                'year_store_base': settings.YEAR_STORE_BASE,
            },
            "countries": CountriesSerializer(countries, many=True).data
        }
        return Response(data)
