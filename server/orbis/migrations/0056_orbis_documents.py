# Generated by Django 3.2.6 on 2021-08-31 15:37

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import orbis.models.models_documents


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orbis', '0055_alter_orb_logo'),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('version', models.CharField(blank=True, max_length=32, null=True)),
                ('type', models.CharField(blank=True, choices=[('GUIDE', 'User Guide'), ('PRIVACY', 'Privacy'), ('TERMS', 'Terms & Conditions')], max_length=32, null=True)),
                ('slug', models.SlugField(editable=False, max_length=160)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('file', models.FileField(upload_to=orbis.models.models_documents.document_file_path, validators=[django.core.validators.FileExtensionValidator(['pdf'])])),
                ('is_active', models.BooleanField(null=True)),
                ('orb', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='orbis.orb')),
            ],
            options={
                'verbose_name': 'Document',
                'verbose_name_plural': 'Documents',
            },
        ),
        migrations.CreateModel(
            name='DocumentAgreement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='agreements', to='orbis.document')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='agreements', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        migrations.AddField(
            model_name='document',
            name='users',
            field=models.ManyToManyField(related_name='documents', through='orbis.DocumentAgreement', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='document',
            constraint=models.UniqueConstraint(fields=('type', 'name', 'version', 'orb'), name='unique_type_name_version_orb'),
        ),
        migrations.AddConstraint(
            model_name='document',
            constraint=models.UniqueConstraint(condition=models.Q(('orb', None)), fields=('type', 'name', 'version'), name='unique_type_name_version'),
        ),
        migrations.AddConstraint(
            model_name='document',
            constraint=models.UniqueConstraint(fields=('type', 'name', 'orb', 'is_active'), name='unique_type_name_orb_active'),
        ),
        migrations.AddConstraint(
            model_name='document',
            constraint=models.UniqueConstraint(condition=models.Q(('orb', None)), fields=('type', 'name', 'is_active'), name='unique_type_name_active'),
        ),
    ]
