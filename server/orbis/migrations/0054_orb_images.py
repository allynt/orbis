# Generated by Django 3.2.5 on 2021-08-11 13:48

from django.db import migrations, models
import django.db.models.deletion
import orbis.models.models_orbs


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0053_orb_terms_document'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrbImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.ImageField(upload_to=orbis.models.models_orbs.orb_image_file_path)),
                ('orb', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='orbis.orb')),
            ],
            options={
                'verbose_name': 'Orb Image',
                'verbose_name_plural': 'Orb Images',
            },
        ),
    ]
