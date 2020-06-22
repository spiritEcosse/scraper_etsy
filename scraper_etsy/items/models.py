from django.db import models
from django.utils.translation import ugettext_lazy as _
from rest_framework import status
from mptt.models import MPTTModel, TreeForeignKey


class Request(MPTTModel):
    PENDING = 0
    DONE = 1
    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (DONE, 'Done'),
    )
    code = models.PositiveSmallIntegerField(
        verbose_name=_("Status code of server"), null=True
    )
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, default=PENDING)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(auto_now_add=True)
    search = models.CharField(verbose_name=_("Search phrase"), max_length=500)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    url = models.URLField(verbose_name=_("Url"), max_length=1000)  # View makes preview this url (get image)

    class MPTTMeta:
        order_insertion_by = ("-started_at", )

    def __str__(self):
        return "search '{}' started at {} has status {}".format(self.search, self.started_at, self.get_status_display())

    def says_done(self):
        self.status = self.DONE

    def is_informational(self):  # 1xx
        return status.is_informational(self.code)

    def is_success(self):        # 2xx
        return status.is_success(self.code)

    def is_redirect(self):       # 3xx
        return status.is_redirect(self.code)

    def is_client_error(self):   # 4xx
        return status.is_client_error(self.code)

    def is_server_error(self):   # 5xx
        return status.is_server_error(self.code)


class Shop(models.Model):
    title = models.CharField(verbose_name=_("Title"), max_length=200)
    request = models.ForeignKey(Request, related_name="shops", related_query_name="shop", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Item(models.Model):
    h1 = models.CharField(verbose_name=_("h1"), max_length=500)
    request = models.ForeignKey(Request, related_name="items", related_query_name="item", on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, related_name="items", related_query_name="item", on_delete=models.CASCADE)

    def __str__(self):
        return self.h1


class Tag(models.Model):
    name = models.CharField(verbose_name=_("Name"), max_length=500)
    item = models.ForeignKey(Item, related_name="tags", related_query_name="tag", on_delete=models.CASCADE)

    def __str__(self):
        return self.name
