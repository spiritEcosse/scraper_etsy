from rest_framework.serializers import ModelSerializer, URLField, CharField
from scraper_etsy.items.models import Request, Tag


class TagSerializer(ModelSerializer):
    # item_url = URLField(source="item.request.url")
    # item_h1 = CharField(source="item.h1")
    # shop_url = CharField(source="item.shop.request.url")

    class Meta:
        model = Tag
        # fields = ("name", "item_url", "item_h1", "shop_url", )
        fields = ("name", )


class RequestsSerializer(ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Request
        fields = ("search", "tags", )


class RequestSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = ("search", )
