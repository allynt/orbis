# Generated by Django 3.2.9 on 2021-11-23 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proxy', '0008_proxydatasource_request_strategy'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proxydatasource',
            name='proxy_authentication_type',
            field=models.CharField(blank=True, choices=[('BASIC', 'Basic'), ('BEARER', 'Bearer'), ('APIKEY', 'Apikey'), ('URL_PARAM', 'Url Param'), ('PASSTHROUGH', 'Passthrough')], help_text='The type of authentication to implement. (Note that if URL_PARAM is selected, it is assumed that the authentication token appears in proxy_params.)', max_length=16, null=True),
        ),
    ]
