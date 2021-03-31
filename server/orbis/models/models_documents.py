import os

from django.conf import settings
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


class DocumentManager(models.Manager):
    def get_active(self):
        try:
            return self.get(is_active=True)
        except self.model.DoesNotExist:
            raise ValidationError(
                f"No active {self.model._meta.verbose_name} found."
            )


##########
# models #
##########


class Document(models.Model):
    class Meta:
        abstract = True

    objects = DocumentManager()

    version = models.SlugField(unique=True)
    is_active = models.BooleanField(
        null=True, unique=True
    )  # forcing a nullable boolean to be unique is a clever way of ensuring only 1 instance can be active

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.version}"


class PrivacyDocument(Document):
    class Meta:
        app_label = "orbis"
        verbose_name = "Privacy Document"
        verbose_name_plural = "Documents: Privacy"

    file = models.FileField(
        upload_to=privacy_media_path, validators=[validate_pdf_extension]
    )


class TermsDocument(Document):
    class Meta:
        app_label = "orbis"
        verbose_name = "Terms Document"
        verbose_name_plural = "Documents: Terms"

    file = models.FileField(
        upload_to=terms_media_path, validators=[validate_pdf_extension]
    )

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="terms",
        through="TermsDocumentAgreement",
    )

    @property
    def has_agreements(self):
        return self.n_agreements > 0

    @property
    def n_agreements(self):
        return self.terms_agreements.count()


class TermsDocumentAgreement(models.Model):
    """
    A "through" model for the relationship between TermsDocument & Users
    """
    class Meta:
        ordering = ["-timestamp"]

    # b/c the extra fields on this through model have default values
    # (auto_add_now), I can just do `user.terms.add(term)` instead of
    # bothering w/ `TermsDocumentAgreement.objects.get_or_create(...)`

    terms = models.ForeignKey(
        TermsDocument,
        on_delete=models.PROTECT,
        related_name="terms_agreements"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="terms_agreements",
    )

    timestamp = models.DateTimeField(auto_now_add=True)
