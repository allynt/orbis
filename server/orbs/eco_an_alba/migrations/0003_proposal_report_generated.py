# Generated by Django 3.2.12 on 2022-04-20 20:47

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eco_an_alba', '0002_proposal'),
    ]

    operations = [
        migrations.AddField(
            model_name='proposal',
            name='report_generated',
            field=models.DateTimeField(default=datetime.datetime(2022, 4, 20, 20, 47, 32, 67814)),
            preserve_default=False,
        ),
    ]
