import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from astrosat.utils import validate_schema

from astrosat_users.models import CustomerUser

##############
# validators #
##############


def validate_data_source_categories(value):
    categories_schema = {
        "definitions": {
            "category": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "child": {
                        "type": "object", "$ref": "#/definitions/category"
                    }
                },
                "required": ["name"]
            }
        },
        "type": "object",
        "$ref": "#/definitions/category"
    }
    return validate_schema(value, categories_schema)


def validate_data_source_orbs(value):
    orbs_schema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                }, "description": {
                    "type": "string"
                }
            },
            "required": ["name"]
        }
    }
    return validate_schema(value, orbs_schema)


########################
# managers / querysets #
########################


class DataStorageQuerySet(models.QuerySet):
    def pending(self):
        return self.filter(status=DataStorage.DataStorageStatus.PENDING)

    def active(self):
        return self.filter(status=DataStorage.DataStorageStatus.ACTIVE)

    def archived(self):
        return self.filter(status=DataStorage.DataStorageStatus.ARCHIVED)

    def has_data_source(self):
        return self.filter(data_source__isnull=False)


class StoredDataSourceQuerySet(models.QuerySet):
    def filter_by_user(self, user):
        return self.filter(customer_user__in=user.customer_users.all())

    def raster(self):
        return self.filter(type=StoredDataSource.TypeChoices.RASTER)

    def vector(self):
        return self.filter(type=StoredDataSource.TypeChoices.VECTOR)

    def pending(self):
        return self.filter(
            data_storage__status=DataStorage.DataStorageStatus.PENDING
        )

    def active(self):
        return self.filter(
            data_storage__status=DataStorage.DataStorageStatus.ACTIVE
        )

    def archived(self):
        return self.filter(
            data_storage__status=DataStorage.DataStorageStatus.ARCHIVED
        )


##########
# models #
##########


# TODO: RENAME DataStorage
class DataStorage(models.Model):
    """
    A record of a stored data object
    """
    class Meta:
        app_label = "orbis"
        verbose_name = "Data Storage"
        verbose_name_plural = "Data Storage"

    DataStorageStatus = models.TextChoices(
        "DataStorageStatus", [
            "PENDING",
            "ACTIVE",
            "ARCHIVED",
        ]
    )

    objects = DataStorageQuerySet.as_manager()

    customer = models.ForeignKey(
        "astrosat_users.Customer",
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        help_text="The customer that 'owns' this data storage object.",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name="storage",
        help_text="The user that created this data storage object",
    )

    title = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        help_text="Title/Name of the data stored",
    )

    created = models.DateTimeField(
        auto_now_add=True,
        help_text="When the Data object was created",
    )

    size = models.FloatField(
        blank=False,
        null=False,
        default=0.0,
        help_text="Size of the data in MBs",
    )

    status = models.CharField(
        max_length=16,
        blank=False,
        null=False,
        choices=DataStorageStatus.choices,
        default=DataStorageStatus.ACTIVE,
    )

    def __str__(self):
        return str(self.title)

    def __repr__(self):
        return f"DataStorage: title={self.title}, created={self.created}, size={self.size}"


class StoredDataSource(models.Model):
    """
    An Abstract Base Class for DataSources which point to
    the actual data referenced by a DataStorage object
    """
    class Meta:
        app_label = "orbis"
        abstract = True
        ordering = ["created"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "customer_user"],
                name="unique_name_per_customer_user",
            )
        ]

    class TypeChoices(models.TextChoices):
        RASTER = "raster", _("raster")
        VECTOR = "vector", _("vector")

    objects = StoredDataSourceQuerySet.as_manager()

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    created = models.DateTimeField(auto_now_add=True, )

    data_storage = models.OneToOneField(
        DataStorage,
        null=True,
        on_delete=models.CASCADE,
        related_name="data_source",
    )

    customer_user = models.ForeignKey(
        CustomerUser,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name="data_sources",
    )

    name = models.CharField(
        max_length=128,
        blank=False,
        null=False,
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    type = models.CharField(
        max_length=16,
        blank=False,
        null=False,
        choices=TypeChoices.choices,
    )

    orbs = models.JSONField(
        blank=True,
        default=list,
        validators=[validate_data_source_orbs],
        help_text="List of orbs that this DataSource belong to.",
    )

    categories = models.JSONField(
        blank=True,
        default=dict,
        validators=[validate_data_source_categories],
        help_text="Dictionary of categories that this DataSource belongs to.",
    )

    @property
    def source_id(self):
        # the frontend just needs a unique string as the "source_id"
        # (no need to bother w/ "<authority/<namespace>/<name>/<version>")
        return str(self.id)

    @property
    def metadata(self):
        raise NotImplementedError(f"{self} must implement 'metadata' property")
