# Generated by Django 3.2.8 on 2021-10-05 12:41

from django.db import migrations, models
import proxy.models


class Migration(migrations.Migration):

    dependencies = [
        ('proxy', '0004_proxydatasource_timeout'),
    ]

    operations = [
        migrations.AddField(
            model_name='proxydatasource',
            name='proxy_headers',
            field=models.JSONField(blank=True, help_text='A dictionary of any extra headers to include in the request to the proxy_url ', null=True, validators=[proxy.models.validate_proxy_headers]),
        ),
    ]
