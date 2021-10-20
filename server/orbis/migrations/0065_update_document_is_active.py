# Generated by Django 3.2.8 on 2021-10-15 20:26

from django.db import migrations


def update_document_is_active(apps, schema_editor):
    DocumentModel = apps.get_model("orbis", "Document")
    DocumentModel.objects.filter(is_active__isnull=True).update(is_active=False)


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0064_document_constraints'),
    ]

    operations = [
        migrations.RunPython(
            update_document_is_active, reverse_code=migrations.RunPython.noop
        ),
    ]