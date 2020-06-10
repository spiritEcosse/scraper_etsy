from rest_framework.serializers import ModelSerializer

from scraper_etsy.items.models import Request


class RequestSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = ("search", )
