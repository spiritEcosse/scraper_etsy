# Generated by Django 3.0.5 on 2021-04-12 10:23

import django.core.validators
from django.db import migrations, models
import scraper_etsy.items.models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0006_auto_20210412_1323'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filter',
            name='year_store_base',
            field=models.PositiveIntegerField(null=True, validators=[django.core.validators.MinValueValidator(1970), scraper_etsy.items.models.validate_year], verbose_name='Year store base'),
        ),
    ]
