import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.deconstruct import deconstructible

##############
# validators #
##############


def terms_media_path(instance, filename):
    return f"documents/terms/{filename}"


def privacy_media_path(instance, filename):
    return f"documents/privacy/{filename}"


def user_guide_media_path(instance, filename):
    return f"documents/guide/{filename}"


def validate_pdf_extension(value):
    ext = os.path.splitext(value.name)[1]
    if ext.lower() != ".pdf":
        raise ValidationError("Unsupported file extension.")


@deconstructible
class FileSizeValidator(object):
    # using a class instead of a fn to allow it to take arguments

    size_units = ["B", "KB", "MB"]

    def __init__(self, max_size, max_size_units="MB"):

        assert max_size_units in self.size_units, f"max_size_units must be one of {', '.join(self.size_units)}"

        self.max_size = max_size
        self.max_size_units = max_size_units

    def __call__(self, value):
        file_size = value.size
        if self.max_size_units == "KB":
            file_size /= 1000
        elif self.max_size_units == "MB":
            file_size /= 1000000

        if file_size > self.max_size:
            raise ValidationError(
                f"The maximum file size is {self.max_size} {self.max_size_units}."
            )


############
# managers #
############


class DocumentManager(models.Manager):
    def get_active(self):
        try:
            return self.get(is_active=True)
        except self.model.DoesNotExist:
            raise ValidationError(
                f"No unique active {self.model._meta.verbose_name} found."
            )


##########
# models #
##########


class Document(models.Model):
    class Meta:
        abstract = True

    objects = DocumentManager()

    name = models.SlugField(blank=False, null=False)
    version = models.SlugField(blank=True, null=True)

    is_active = models.BooleanField(
        null=True
    )  # forcing a nullable boolean to be unique is a clever way of ensuring only 1 instance can be active (subject to the constraints below)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):

        if self.version:
            return f"{self.name} {self.version}"
        return f"{self.name}"


class UserGuideDocument(Document):
    class Meta:
        app_label = "orbis"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "version"], name="unique_guide_name_version"
            ),
            models.UniqueConstraint(
                fields=["name", "is_active"], name="unique_guide_name_active"
            ),
        ]
        verbose_name = "User Guide Document"
        verbose_name_plural = "Documents: User Guide"

    file = models.FileField(
        upload_to=user_guide_media_path,
        validators=[validate_pdf_extension, FileSizeValidator(16)]
    )


class PrivacyDocument(Document):
    class Meta:
        app_label = "orbis"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "version"], name="unique_privacy_name_version"
            ),
            models.UniqueConstraint(
                fields=["name", "is_active"], name="unique_privacy_name_active"
            ),
        ]
        verbose_name = "Privacy Document"
        verbose_name_plural = "Documents: Privacy"

    file = models.FileField(
        upload_to=privacy_media_path,
        validators=[validate_pdf_extension, FileSizeValidator(16)]
    )


class TermsDocument(Document):
    class Meta:
        app_label = "orbis"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "version"], name="unique_terms_name_version"
            ),
            models.UniqueConstraint(
                fields=["name", "is_active"], name="unique_terms_name_active"
            ),
        ]

        verbose_name = "Terms Document"
        verbose_name_plural = "Documents: Terms"

    file = models.FileField(
        upload_to=terms_media_path,
        validators=[validate_pdf_extension, FileSizeValidator(16)]
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
