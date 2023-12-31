# Generated by Django 3.0.8 on 2020-07-23 10:28

import django.contrib.postgres.fields.jsonb
from django.db import migrations
import maps.models.models_bookmarks


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0009_auto_20200228_1631'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookmark',
            name='layers',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, help_text='A list of all the source_ids of the data layers loaded on the map.', null=True, validators=[maps.models.models_bookmarks.validate_layers]),
        ),
        migrations.AlterField(
            model_name='bookmark',
            name='feature_collection',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, help_text='a GeoJSON description of the annotations on the map.', null=True, validators=[maps.models.models_bookmarks.validate_feature_collection]),
        ),
    ]
