from django.db.models import Prefetch
from django_countries import countries
from rest_framework import viewsets
from rest_framework.response import Response

from scraper_etsy.items.models import Request, Tag
from scraper_etsy.items import serializer as items_serializers
from scraper_etsy.items.tasks import search
from django.conf import settings


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = items_serializers.RequestSerializer
    queryset = Request.objects.filter(level=0).prefetch_related(
        Prefetch(
            "children", queryset=Request.objects.exclude(item__isnull=True),
            to_attr="children_have_item"
        ),
        Prefetch(
            "children_have_item__item__tags", queryset=Tag.objects.distinct("name"),
            to_attr="unique_tags"
        ),
        "children_have_item__item__shop__request"
    )[:3]
    url = "https://www.etsy.com/search?q={}"

    def perform_create(self, serializer):
        serializer.validated_data.update({'url': self.url.format(serializer.validated_data['search'])})
        super(RequestViewSet, self).perform_create(serializer)
        search.s(serializer.instance.id).apply_async(countdown=settings.COUNTDOWN)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        data = []

        for request in queryset:
            request_ = {
                "id": request.id,
                "search": request.search,
                "status": request.get_status_display(),
                "started_at": request.show_started_at(),
                'items': []
            }
            data.append(request_)

            for child in request.children_have_item:
                item = child.item
                item_ = {
                    "id": item.id,
                    "url": item.request.url,
                    "shop_url": item.shop.request.url,
                    'tags': []
                }
                request_['items'].append(item_)

                for tag in item.unique_tags:
                    item_['tags'].append(
                        {
                            "id": tag.id,
                            "name": tag.name,
                        }
                    )

        return Response(data)


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
            'countries': items_serializers.CountriesSerializer(countries, many=True).data,
        }
        return Response(data)
