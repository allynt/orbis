# Generated by Django 3.2.5 on 2021-08-11 11:27

import django.core.validators
from django.db import migrations, models
import orbis.models.models_orbs


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0052_orb_short_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='orb',
            name='terms_document',
            field=models.FileField(blank=True, null=True, upload_to=orbis.models.models_orbs.orb_terms_document_path, validators=[django.core.validators.FileExtensionValidator(['pdf'])]),
        ),
    ]