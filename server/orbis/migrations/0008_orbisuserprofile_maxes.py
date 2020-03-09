# Generated by Django 2.2 on 2020-03-02 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0007_orbissettings'),
    ]

    operations = [
        migrations.AddField(
            model_name='orbisuserprofile',
            name='max_results',
            field=models.PositiveIntegerField(default=10, help_text='The maximum number of saved search results allowed for this user.'),
        ),
        migrations.AddField(
            model_name='orbisuserprofile',
            name='max_searches',
            field=models.PositiveIntegerField(default=10, help_text='The maximum number of saved searches allowed for this user.'),
        ),
    ]