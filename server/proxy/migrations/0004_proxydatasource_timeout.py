# Generated by Django 3.2.6 on 2021-09-09 11:21

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proxy', '0003_proxyauthentication'),
    ]

    operations = [
        migrations.AddField(
            model_name='proxydatasource',
            name='timeout',
            field=models.IntegerField(default=0, help_text='Is there a limit on how frequently (in seconds) the remote data source can be accessed?', validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
