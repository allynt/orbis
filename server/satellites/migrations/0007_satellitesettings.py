# Generated by Django 3.2.5 on 2021-07-28 13:00

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('satellites', '0006_auto_20210723_1403'),
    ]

    operations = [
        migrations.CreateModel(
            name='SatelliteSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maximum_aoi_area', models.FloatField(default=500, help_text='The maximum area (in kilometres) that can be used as a query argument.', validators=[django.core.validators.MaxValueValidator(500000000), django.core.validators.MinValueValidator(1)])),
            ],
            options={
                'verbose_name': 'Satellite Settings',
                'verbose_name_plural': 'Satellite Settings',
            },
        ),
    ]
