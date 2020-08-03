# Generated by Django 3.0.5 on 2020-08-01 17:38

from django.db import migrations
import django_countries.fields


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0002_auto_20200720_1056'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filter',
            name='countries',
            field=django_countries.fields.CountryField(default=[], max_length=746, multiple=True),
        ),
        migrations.AlterField(
            model_name='shop',
            name='location',
            field=django_countries.fields.CountryField(max_length=2, null=True),
        ),
    ]
