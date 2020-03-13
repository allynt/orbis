# Generated by Django 2.2 on 2020-03-13 11:48

import django.contrib.gis.db.models.fields
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import orbis.models.models_satellites


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0012_auto_20200309_1556'),
    ]

    operations = [
        migrations.RenameField(
            model_name='satelliteresult',
            old_name='properties',
            new_name='metadata',
        ),
        migrations.AddField(
            model_name='satelliteresult',
            name='created',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='satelliteresult',
            name='raw_data',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, help_text="The original 'raw' data returned by the search.", null=True, validators=[orbis.models.models_satellites.validate_properties]),
        ),
        migrations.AlterField(
            model_name='satelliteresult',
            name='footprint',
            field=django.contrib.gis.db.models.fields.GeometryField(srid=4326),
        ),
    ]
