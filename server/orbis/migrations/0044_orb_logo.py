# Generated by Django 3.2.2 on 2021-06-01 14:21

from django.db import migrations, models
import orbis.models.models_orbs


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0043_orbisuserfeedbackrecord'),
    ]

    operations = [
        migrations.AddField(
            model_name='orb',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to=orbis.models.models_orbs.orb_logo_path),
        ),
    ]
