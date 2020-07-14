from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers

from scraper_etsy.items.models import Request, Tag, Filter


class TagSerializer(serializers.ModelSerializer):
    # item_url = URLField(source="item.request.url")
    # item_h1 = CharField(source="item.h1")
    # shop_url = CharField(source="item.shop.request.url")

    class Meta:
        model = Tag
        # fields = ("name", "item_url", "item_h1", "shop_url", )
        fields = ("name", )


class RequestsSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Request
        fields = ("search", "tags", )


class FilterSerializer(CountryFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = Filter
        validators = []
        fields = ("limit", "count_tags", "sales", "year_store_base", "countries")

    @staticmethod
    def get_or_create(validated_data):
        return Filter.objects.get_or_create(**validated_data)[0]


class RequestSerializer(serializers.ModelSerializer):
    filter = FilterSerializer()

    class Meta:
        model = Request
        fields = ("search", "filter", )

    def create(self, validated_data):
        validated_data['filter'] = self.fields['filter'].get_or_create(validated_data.pop('filter'))
        return super(RequestSerializer, self).create(validated_data)


class CountriesSerializer(CountryFieldMixin, serializers.Serializer):
    code = serializers.CharField()
    name = serializers.CharField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass
