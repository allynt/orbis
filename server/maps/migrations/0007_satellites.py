# Generated by Django 2.2 on 2020-02-03 17:13

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0006_auto_20200131_1234'),
    ]

    operations = [
        migrations.CreateModel(
            name='Satellite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('satellite_id', models.SlugField(help_text='A unique id for the satellite.', unique=True)),
                ('title', models.CharField(help_text='A pretty display name for the satellite.', max_length=128)),
                ('description', models.TextField(blank=True, help_text='A description of the satellite.', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SatelliteVisualisation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visualisation_id', models.SlugField(help_text='A unique id for the visualisation.')),
                ('title', models.CharField(help_text='A pretty display name for the visualisation.', max_length=128)),
                ('description', models.TextField(blank=True, help_text='A description of the visualisation.', null=True)),
                ('thumbnail', models.FileField(blank=True, help_text='A thumbnail image representing this bookmark.', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SatelliteScene',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scene_id', models.SlugField(help_text='A unique id for the scene.')),
                ('properties', django.contrib.postgres.fields.jsonb.JSONField(blank=True, help_text='Some more information to associate with the scene.', null=True, validators=[])),
                ('urls', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True, validators=[])),
                ('thumbnail', models.URLField(blank=True, help_text="The location of this scene's thumbnail; This is an external URL so it is not managed by the app.", null=True)),
                ('satellite', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scenes', to='maps.Satellite')),
            ],
        ),
        migrations.AddConstraint(
            model_name='satellitescene',
            constraint=models.UniqueConstraint(fields=('scene_id', 'satellite'), name='unique_satellite_scene'),
        ),
    ]