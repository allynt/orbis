# Generated by Django 2.2 on 2019-12-10 15:14

import astrosat_users.models.models_profiles
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orbis', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrbisUserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', astrosat_users.fields.UserProfileField(on_delete=django.db.models.deletion.CASCADE, related_name='orbis_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Orbis User Profile',
                'verbose_name_plural': 'Orbis User Profiles',
            },
        ),
    ]
