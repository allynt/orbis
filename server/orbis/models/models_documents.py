import os

from django.core.exceptions import ValidationError
from django.db import models

###########
# helpers #
###########


def terms_media_path(instance, filename):
    return f"documents/terms/{filename}"


def privacy_media_path(instance, filename):
    return f"documents/privacy/{filename}"


def validate_pdf_extension(value):
    ext = os.path.splitext(value.name)[1]
    if ext.lower() != ".pdf":
        raise ValidationError("Unsupported file extension.")


##########
# models #
##########


class Document(models.Model):
    class Meta:
        abstract = True

    version = models.SlugField(unique=True)
    is_active = models.BooleanField(
        null=True, unique=True
    )  # forcing a nullable boolean to be unique is a clever way of ensuring only 1 instance can be active

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.version}"


class TermsDocument(Document):
    class Meta:
        app_label = "orbis"
        verbose_name = "Terms Document"
        verbose_name_plural = "Documents: Terms"

    file = models.FileField(
        upload_to=terms_media_path, validators=[validate_pdf_extension]
    )


class PrivacyDocument(Document):
    class Meta:
        app_label = "orbis"
        verbose_name = "Privacy Document"
        verbose_name_plural = "Documents: Privacy"

    file = models.FileField(
        upload_to=privacy_media_path, validators=[validate_pdf_extension]
    )
