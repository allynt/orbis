# Generated by Django 3.1 on 2020-08-15 07:11

from django.db import migrations, models
import orbis.models.models_satellites


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0025_default_roles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='satelliteresult',
            name='metadata',
            field=models.JSONField(blank=True, help_text='Some more information to associate with the scene.', null=True, validators=[orbis.models.models_satellites.validate_properties]),
        ),
        migrations.AlterField(
            model_name='satelliteresult',
            name='raw_data',
            field=models.JSONField(blank=True, help_text="The original 'raw' data returned by the search.", null=True, validators=[orbis.models.models_satellites.validate_properties]),
        ),
    ]
