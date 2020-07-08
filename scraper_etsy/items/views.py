from django.db.models import Prefetch
from rest_framework import viewsets
from rest_framework.response import Response

from scraper_etsy.items.models import Request
from scraper_etsy.items.serializer import RequestSerializer, RequestsSerializer
from scraper_etsy.items.tasks import search


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    list_serializer_class = RequestsSerializer
    queryset = Request.objects.filter(level=0).prefetch_related(
        Prefetch(
            "children", queryset=Request.objects.exclude(item__isnull=True),
            to_attr="children_have_item"
        ),
        "children_have_item__item__tags",
        "children_have_item__item__shop__request",
    )[:10]
    url = "https://www.etsy.com/search?q={}"

    def perform_create(self, serializer):
        serializer.validated_data.update({'url': self.url.format(serializer.validated_data['search'])})
        super(RequestViewSet, self).perform_create(serializer)
        search.delay(serializer.instance.id)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        data = []

        for request in queryset:
            request_ = {"search": request.search, 'tags': []}

            for child in request.children_have_item:
                item = child.item

                for tag in item.tags.all():
                    request_['tags'].append(
                        {
                            "name": tag.name,
                            "item_h1": item.h1,
                            "item_url": item.request.url,
                            "shop_url": item.shop.request.url
                        }
                    )

            data.append(request_)
        return Response(data)
