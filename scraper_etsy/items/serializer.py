from django.conf import settings
from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers

from scraper_etsy.items.models import Request, Tag, Filter, Item


class CreateUpdatePass:
    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class CountriesSerializer(CreateUpdatePass, CountryFieldMixin, serializers.Serializer):
    code = serializers.CharField()
    name = serializers.CharField()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name", "id", )


class FilterSerializer(CountryFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = Filter
        validators = []
        fields = ("limit", "count_tags", "sales", "year_store_base", "countries")

    @staticmethod
    def get_or_create(validated_data):
        return Filter.objects.get_or_create(**validated_data)[0]


class ItemSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    url = serializers.URLField(source="request.url")
    shop_url = serializers.URLField(source="shop.request.url")

    class Meta:
        model = Item
        fields = ("id", "url", "shop_url", "tags", )


class RequestChildSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = Request
        fields = ("item", )


class RequestSerializer(serializers.ModelSerializer):
    filter = FilterSerializer()
    children = RequestChildSerializer(required=False, source="children_have_item", many=True)
    status = serializers.CharField(required=False, source="get_status_display")
    started_at = serializers.DateTimeField(required=False, format=settings.DATETIME_FORMAT[0])
    ended_at = serializers.DateTimeField(required=False, format=settings.DATETIME_FORMAT[0])

    class Meta:
        model = Request
        fields = ("id", "search", "status", "started_at", "ended_at", "filter", "children", )

    def create(self, validated_data):
        validated_data['filter'] = self.fields['filter'].get_or_create(validated_data.pop('filter'))
        return super(RequestSerializer, self).create(validated_data)
