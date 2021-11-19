# Generated by Django 3.2.8 on 2021-11-17 13:44

from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import maps.models.models_aois


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('maps', '0014_alter_bookmark_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aoi',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Name of the AOI instance', max_length=128)),
                ('description', models.TextField(blank=True, help_text='Description of the AOI instance', null=True)),
                ('created', models.DateTimeField(auto_now_add=True, help_text='When the AOI was first created.')),
                ('modified', models.DateTimeField(auto_now=True, help_text='When the AOI was last modified.')),
                ('thumbnail', models.FileField(blank=True, help_text='The thumbnail image representing an AOI.', null=True, upload_to=maps.models.models_aois.aoi_thumbnail_path)),
                ('geometry', django.contrib.gis.db.models.fields.GeometryField(srid=4326)),
                ('owner', models.ForeignKey(help_text='Owner of the AOI', on_delete=django.db.models.deletion.CASCADE, related_name='aois', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'AOI',
                'verbose_name_plural': 'AOIs',
            },
        ),
        migrations.AddConstraint(
            model_name='aoi',
            constraint=models.UniqueConstraint(fields=('name', 'owner'), name='unique_name_per_user'),
        ),
    ]
