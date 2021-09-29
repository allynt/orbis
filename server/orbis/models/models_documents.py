import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MaxValueValidator
from django.db import models
from django.db.models import Q
from django.utils.deconstruct import deconstructible
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

###########
# helpers #
###########


def terms_media_path(instance, filename):
    return f"documents/terms/{filename}"


def privacy_media_path(instance, filename):
    return f"documents/privacy/{filename}"


def user_guide_media_path(instance, filename):
    return f"documents/guide/{filename}"


def document_file_path(instance, filename):

    return "/".join(
        filter(
            None,
            [
                "documents",
                instance.type,
                slugify(f"orbs/{instance.orb.name}") if instance.orb else None,
                filename,
            ]
        )
    )


#############
# constants #
#############


class DocumentType(models.TextChoices):
    GUIDE = "GUIDE", _("User Guide")
    PRIVACY = "PRIVACY", _("Privacy")
    TERMS = "TERMS", _("Terms & Conditions")


##############
# validators #
##############


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

# class DocumentManager(models.Manager):
#     def get_active(self):
#         try:
#             return self.get(is_active=True)
#         except self.model.DoesNotExist:
#             raise ValidationError(
#                 f"No unique active {self.model._meta.verbose_name} found."
#             )


class DocumentManager(models.Manager):
    pass


class DocumentQuerySet(models.QuerySet):
    def guide(self):
        return self.filter(type=DocumentType.GUIDE)

    def privacy(self):
        return self.filter(type=DocumentType.PRIVACY)

    def terms(self):
        return self.filter(type=DocumentType.TERMS)

    def active(self):
        return self.filter(is_active=True)

    def no_orbs(self):
        """
        returns Documents that are not associated w/ any Orb
        """
        return self.filter(orb__isnull=True)


##########
# models #
##########


class Document(models.Model):
    class Meta:
        app_label = "orbis"
        constraints = [
            # multiple constraints to handle instances w/ & w/out null ForeignKey
            # as per: https://stackoverflow.com/a/58830230/1060339
            models.UniqueConstraint(
                fields=["type", "name", "version", "orb"],
                name="unique_type_name_version_orb"
            ),
            models.UniqueConstraint(
                fields=["type", "name", "version"],
                condition=Q(orb=None),
                name="unique_type_name_version"
            ),
            models.UniqueConstraint(
                fields=["type", "name", "orb", "is_active"],
                name="unique_type_name_orb_active"
            ),
            models.UniqueConstraint(
                fields=["type", "name", "is_active"],
                condition=Q(orb=None),
                name="unique_type_name_active"
            ),
        ]
        verbose_name = "Document"
        verbose_name_plural = "Documents"

    objects = DocumentManager.from_queryset(DocumentQuerySet)()

    name = models.CharField(max_length=128, blank=False, null=False)
    version = models.CharField(max_length=32, blank=True, null=True)
    type = models.CharField(
        max_length=32, choices=DocumentType.choices, blank=True, null=True
    )
    slug = models.SlugField(
        max_length=128 + 32, editable=False, blank=False, null=False
    )
    title = models.CharField(max_length=128, blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    file = models.FileField(
        upload_to=document_file_path,
        validators=[FileExtensionValidator(["pdf"])],
    )

    is_active = models.BooleanField(
        null=True
    )  # forcing a nullable boolean to be unique is a clever way of ensuring only 1 instance can be active (subject to the constraints above)

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="documents",
        through="DocumentAgreement",
    )
    orb = models.ForeignKey(
        "Orb",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="documents",
    )

    def __str__(self):
        return " - ".join(filter(None, [self.name, self.version]))

    @property
    def has_agreements(self):
        return self.n_agreements > 0

    @property
    def n_agreements(self):
        return self.agreements.count()

    def save(self, *args, **kwargs):
        self.slug = slugify(str(self))
        return super().save(*args, **kwargs)


class DocumentAgreement(models.Model):
    """
    A "through" model for the relationship between Documents & Users
    """
    class Meta:
        ordering = ["-timestamp"]

    # b/c the extra fields on this through model have default values
    # (auto_add_now), I can just do `user.documents.add(document)` instead of
    # bothering w/ `DocumentAgreement.objects.get_or_create(...)`

    document = models.ForeignKey(
        Document, on_delete=models.PROTECT, related_name="agreements"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="agreements",
    )

    timestamp = models.DateTimeField(auto_now_add=True)
