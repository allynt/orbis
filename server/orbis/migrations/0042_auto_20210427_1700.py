# Generated by Django 3.2 on 2021-04-27 17:00

from django.db import migrations, models
import orbis.models.models_documents


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0041_auto_20210426_1812'),
    ]

    operations = [
        migrations.AlterField(
            model_name='privacydocument',
            name='file',
            field=models.FileField(upload_to=orbis.models.models_documents.privacy_media_path, validators=[orbis.models.models_documents.validate_pdf_extension, orbis.models.models_documents.FileSizeValidator(16)]),
        ),
        migrations.AlterField(
            model_name='termsdocument',
            name='file',
            field=models.FileField(upload_to=orbis.models.models_documents.terms_media_path, validators=[orbis.models.models_documents.validate_pdf_extension, orbis.models.models_documents.FileSizeValidator(16)]),
        ),
        migrations.AlterField(
            model_name='userguidedocument',
            name='file',
            field=models.FileField(upload_to=orbis.models.models_documents.user_guide_media_path, validators=[orbis.models.models_documents.validate_pdf_extension, orbis.models.models_documents.FileSizeValidator(16)]),
        ),
    ]
