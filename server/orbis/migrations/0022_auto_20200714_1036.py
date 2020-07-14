# Generated by Django 3.0.8 on 2020-07-14 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0021_auto_20200709_1515'),
    ]

    operations = [
        migrations.AddField(
            model_name='datascope',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='datascope',
            name='orbs',
            field=models.ManyToManyField(blank=True, related_name='data_scopes', to='orbis.Orb'),
        ),
    ]
