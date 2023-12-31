# Generated by Django 3.2.8 on 2021-10-25 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0066_alter_document_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='orb',
            name='can_purchase',
            field=models.BooleanField(
                default=True,
                help_text='Only Licences to purchasable Orbs can be ordered.'
            ),
        ),
    ]
