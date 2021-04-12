from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from django.conf.urls import url

from scraper_etsy.items.views import RequestViewSet, FilterView
from scraper_etsy.users.api.views import UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("items", RequestViewSet)

urlpatterns = [
    url(r'filter/', FilterView.as_view()),
]

app_name = "api"
urlpatterns = router.urls + urlpatterns
