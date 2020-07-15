from datetime import date

from django.conf import settings
from django.core.validators import MinValueValidator, ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from mptt.models import MPTTModel, TreeForeignKey
from rest_framework import status


def validate_year(value):
    if value > date.today().year:
        raise ValidationError(
            _('%(value)s is more than today year'),
            params={'value': value},
        )


class Filter(models.Model):
    limit = models.PositiveIntegerField(
        verbose_name=_("Limit of listings"),
        validators=(MinValueValidator(1), ),
        default=settings.LIMIT
    )
    count_tags = models.PositiveIntegerField(
        verbose_name=_("Count of tags"),
        validators=(MinValueValidator(1), ),
        default=settings.COUNT_TAGS
    )
    sales = models.PositiveIntegerField(
        verbose_name=_("Count of sales"),
        validators=(MinValueValidator(1), ),
        default=settings.SALES
    )
    year_store_base = models.PositiveIntegerField(
        verbose_name=_("Year store base"),
        validators=(MinValueValidator(1970), validate_year, ),
        default=settings.YEAR_STORE_BASE
    )
    countries = CountryField(multiple=True, default=settings.COUNTRIES)

    class Meta:
        unique_together = (("limit", "count_tags", "sales", "year_store_base", "countries"), )

    def __str__(self):
        return self.limit, self.count_tags, self.sales, self.year_store_base, self.countries


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
    filter = models.ForeignKey(Filter, verbose_name=_("Filter"), null=True, blank=True, on_delete=models.CASCADE)

    class MPTTMeta:
        order_insertion_by = ("-started_at", )

    def __str__(self):
        return "search '{}' started at {} has status {}".format(self.search, self.started_at, self.get_status_display())

    def get_descendants_by_level(self, level=1):
        return self.get_descendants().filter(level__gte=self.level + level)

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

    def tags(self):
        return Tag.objects.filter(
            item__request__parent=self
        ).distinct("name")


class Shop(models.Model):
    title = models.CharField(verbose_name=_("Title"), max_length=200, unique=True)
    request = models.OneToOneField(Request, related_name="shop", on_delete=models.CASCADE)
    year_store_base = models.DateField(verbose_name=_("Shop opening date"))
    sales = models.IntegerField(verbose_name=_("Total sales"))
    location = CountryField()

    def __str__(self):
        return self.title


class Item(models.Model):
    h1 = models.CharField(verbose_name=_("h1"), max_length=500)
    request = models.OneToOneField(Request, related_name="item", related_query_name="item", on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, related_name="items", related_query_name="item", on_delete=models.CASCADE)

    def __str__(self):
        return self.h1


class Tag(models.Model):
    name = models.CharField(verbose_name=_("Name"), max_length=500)
    item = models.ForeignKey(Item, related_name="tags", related_query_name="tag", on_delete=models.CASCADE)

    class Meta:
        ordering = ("name", )

    def __str__(self):
        return self.name
