# Generated by Django 3.1.7 on 2021-04-13 16:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0012_bookmark_orbs'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bookmark',
            old_name='feature_collection',
            new_name='drawn_feature_collection',
        ),
    ]
