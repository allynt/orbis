# Generated by Django 3.1.7 on 2021-04-09 12:10

import django.core.validators
from django.db import migrations, models
import orbis.models.models_orbs


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0037_datascope_applications'),
    ]

    operations = [
        migrations.AlterField(
            model_name='licence',
            name='access',
            field=models.PositiveIntegerField(default=orbis.models.models_orbs.Access['READ'], validators=[django.core.validators.MaxValueValidator(15)]),
        ),
    ]
