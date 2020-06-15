from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from scraper_etsy.items.views import RequestViewSet
from scraper_etsy.users.api.views import UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("items", RequestViewSet)


app_name = "api"
urlpatterns = router.urls
