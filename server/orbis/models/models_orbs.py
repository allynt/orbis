from collections import OrderedDict
from enum import IntFlag
from functools import partial
import fnmatch
import re
import uuid

from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MaxValueValidator
from django.db import models
from django.db.models import F, Value, ExpressionWrapper
from django.db.models.functions import Concat, Replace
from django.utils.text import slugify

from astrosat.utils import CONDITIONAL_CASCADE, validate_schema
from astrosat_users.models import Customer, CustomerUser
"""
models_orbs includes all the classes used to define:

* Orbs - a thematic collection of data & functionality; a "product"
* DataScopes - a pattern defining which data from *data-sources-directory* can be accessed
* Licence - a way to map orbs to Customers (and CustomerUsers); a "subscription"
* Access - a clever little model to encode the access type for a given Licence

An orb can contain multiple data_scopes.  A licence refers to a single orb.

A JWT is created for a user based on the licences held by that user.

A user can only hold a licence if it is owned by that user's customer (and not in use by another user).

"""

###########
# helpers #
###########

SOURCE_ID_PARTS = ["authority", "namespace", "name", "version"]

SOURCE_ID_REGEX = re.compile(
    r"([A-Za-z0-9_\-]+)/([A-Za-z0-9_\-]+)/([A-Za-z0-9_\-]+)/([A-Za-z0-9_\-]+)"
)


class Access(IntFlag):
    READ = 1  # 0001
    CREATE = 2  # 0010
    DELETE = 4  # 0100
    UPDATE = 8  # 1000

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class AccessModel(models.Model):
    class Meta:
        abstract = True

    access = models.PositiveIntegerField(
        default=Access.READ, validators=[MaxValueValidator(sum(Access))]
    )

    @property
    def can_read(self):
        return self.has_access_scope(Access.READ)

    @property
    def can_create(self):
        return self.has_access_scope(Access.CREATE)

    @property
    def can_delete(self):
        return self.has_access_scope(Access.DELETE)

    @property
    def can_update(self):
        return self.has_access_scope(Access.UPDATE)

    def has_access_scope(self, access_scope):
        return self.access & access_scope


def orb_image_file_path(instance, filename):
    orb_name = slugify(instance.orb.name)
    return f"orbs/{orb_name}/images/{filename}"


def orb_logo_path(instance, filename):
    instance_name = slugify(instance.name)
    return f"orbs/{instance_name}/{filename}"


def orb_terms_document_path(instance, filename):
    instance_name = slugify(instance.name)
    return f"orbs/{instance_name}/terms/{filename}"


def validate_orb_features(value):
    """
    A simple validator that ensures orb.features is a list of strings
    """
    features_schema = {"type": "array", "items": {"type": "string"}}
    return validate_schema(value, features_schema)


########################
# managers & querysets #
########################


class OrbManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class OrbQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def default(self):
        return self.filter(is_default=True)

    def hidden(self):
        return self.filter(is_hidden=True)

    def visible(self):
        return self.filter(is_hidden=False)

    def exclusive(self):
        return self.filter(is_exclusive=True)


class DataScopeManager(models.Manager):
    def get_by_natural_key(self, source_id_pattern):
        kwargs = {
            key: value
            for key,
            value in zip(
                ["authority", "namespace", "name", "version"],
                source_id_pattern.split("/"),
            )
        }
        instance = self.get(**kwargs)
        return instance


class DataScopeQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def matches_source_id(self, source_id):
        """
        Returns all the DataScopes whose source_id_pattern matches the given source_id
        This filter is no longer used by the DataSourceView, but it may prove useful in the future.
        """
        # yapf: disable

        # first ensure source_id is valid...
        match = SOURCE_ID_REGEX.match(source_id)
        if not match:
            raise ValueError(f"Not a valid source id: {source_id}")
        source_id_parts = {
            f"_source_id_{part}": ExpressionWrapper(Value(match.group(i)), output_field=models.CharField())
            for i, part in enumerate(SOURCE_ID_PARTS, start=1)
        }

        # and store it in the qs...
        qs = self.annotate(**source_id_parts)

        # then convert the current pattern fnmatch syntax to regex syntax...
        source_id_pattern_regex_parts = OrderedDict()
        for part in SOURCE_ID_PARTS:
            source_id_pattern_regex_parts[f"___source_id_pattern_{part}"] = Concat(Value("^"), F(part), Value("$"))
            source_id_pattern_regex_parts[f"__source_id_pattern_{part}"] = Replace(F(f"___source_id_pattern_{part}"), Value("*"), Value(".*"))
            source_id_pattern_regex_parts[f"_source_id_pattern_{part}"] = Replace(F(f"__source_id_pattern_{part}"), Value("?"), Value("."))

        # and store it in the qs...
        qs = qs.annotate(**source_id_pattern_regex_parts)

        # then construct and run the actual filter...
        filter_expressions = {
            f"_source_id_{part}__regex": F(f"_source_id_pattern_{part}")
            for part in SOURCE_ID_PARTS
        }
        return qs.filter(**filter_expressions)


class LicenceQuerySet(models.QuerySet):
    def hidden(self):
        # returns the licences that should be excluded from serialization
        return self.filter(orb__is_hidden=True)

    def visible(self):
        # returns the licences that shouldn't be exluded from serialization
        return self.filter(orb__is_hidden=False)

    def purchased(self):
        # returns all licences (just defined for symmetry w/ the frontend)
        return self

    def active(self):
        # returns all licences that have been assigned to a user
        return self.filter(customer_user__isnull=False)

    def default(self):
        # returns all licecnecs to default orbs
        return self.filter(orb__is_default=True)

    def exclusive(self):
        # returns all licences to exclusive orbs
        return self.filter(orb__is_exclusive=True)

    def available(self):
        # returns all licence that have not been assigned to a user
        return self.filter(customer_user__isnull=True)

    def can_read(self):
        return self.has_access_scope(Access.READ)

    def can_create(self):
        return self.has_access_scope(Access.CREATE)

    def can_delete(self):
        return self.has_access_scope(Access.DELETE)

    def can_update(self):
        return self.has_access_scope(Access.UPDATE)

    def has_access_scope(self, access_scope):
        return self.annotate(
            can_access=F("access").bitand(access_scope)
        ).filter(can_access__gte=1)


##########
# models #
##########


class Orb(models.Model):
    """
    An orb is a thematic collection of data & functionality.
    Orbs can be categorised using the following flags:
     * is_active - only active orbs are used when assigning licences
     * is_default - licences to default orbs are automatically assigned to users upon registration, and deleted when those users are deleted
     * is_hidden - a hidden orb does not appear in the Orbis Store
     * is_exclusive - a licence to an exclusive orb cannot co-exist with any other licences; an exclusive licence of a user is automatically revoked whenever a licence to a non-exclusive orb is assigned to that user
    """
    class Meta:
        app_label = "orbis"
        verbose_name = "Orb"
        verbose_name_plural = "Orbs"

    objects = OrbManager.from_queryset(OrbQuerySet)()

    name = models.CharField(
        max_length=128, unique=True, blank=False, null=False
    )
    description = models.TextField(blank=True, null=True)
    short_description = models.CharField(max_length=512, blank=True, null=True)
    logo = models.FileField(
        blank=True,
        null=True,
        upload_to=orb_logo_path,
        validators=[FileExtensionValidator(["svg"])],
    )

    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(
        default=False,
        help_text="Licences to default Orbs are automatically granted upon registration."
    )
    is_hidden = models.BooleanField(
        default=False,
        help_text="Licences to a hidden Orb are not shown to CustomerUsers."
    )
    is_exclusive = models.BooleanField(
        default=False,
        help_text="Licences to exclusive Orbs are automatically removed when licences to other orbs are assigned; they cannot co-exist."
    )

    features = models.JSONField(
        blank=True,
        default=list,
        validators=[validate_orb_features],
        help_text="List of features that this orb supports."
    )


    licence_cost = models.FloatField(
        default=0, help_text="The cost of a single licence to this Orb."
    )

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name, )

class OrbImage(models.Model):
    """
    A simple model for associating multiple images w/ Orbs.
    Had to use a separate model b/c Django does not support ArrayField for FileFields.
    That's okay b/c this lets me use a straightforward inline in the OrbAdmin.
    """
    class Meta:
        app_label = "orbis"
        verbose_name = "Orb Image"
        verbose_name_plural = "Orb Images"

    orb = models.ForeignKey(Orb, blank=False, null=False, on_delete=models.CASCADE, related_name="images")
    file = models.ImageField(blank=False, null=False, upload_to=orb_image_file_path)

    def delete(self, *args, **kwargs):
        """
        When an OrbImage instance is deleted, delete the corresponding file from storage.
        """
        if self.file:
            file_name = self.file.name
            file_storage = self.file.storage
            if file_storage.exists(file_name):
                file_storage.delete(file_name)

        return super().delete(*args, **kwargs)


class DataScope(models.Model):
    class Meta:
        app_label = "orbis"
        verbose_name = "Data Scope"
        verbose_name_plural = "Data Scopes"
        constraints = [
            models.UniqueConstraint(
                fields=["authority", "namespace", "name", "version"],
                name="unique_source_id_pattern",
            )
        ]

    objects = DataScopeManager.from_queryset(DataScopeQuerySet)()

    authority = models.CharField(max_length=128, default="*")
    namespace = models.CharField(max_length=128, default="*")
    name = models.CharField(max_length=128, default="*")
    version = models.CharField(max_length=128, default="*")

    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)

    orbs = models.ManyToManyField(Orb, blank=True, related_name="data_scopes")

    applications = ArrayField(
        models.CharField(max_length=128),
        blank=True,
        default=list,
        help_text=
        "An optional array of applications that this DataScope derives its data from"
    )

    def __str__(self):
        return self.source_id_pattern

    @property
    def source_id_pattern(self):
        return f"{self.authority}/{self.namespace}/{self.name}/{self.version}"

    @staticmethod
    def matches_source_id(source_id_pattern, source_id):
        """
        Checks if a given source_id_pattern matches a given source_id.
        """
        for source_id_part, source_id_pattern_part in zip(source_id.split("/"), source_id_pattern.split("/")):
            if not fnmatch.fnmatch(source_id_part, source_id_pattern_part):
                return False
        return True

    def natural_key(self):
        return (self.source_id_pattern, )


class Licence(AccessModel):
    class Meta:
        app_label = "orbis"
        verbose_name = "Licence"
        verbose_name_plural = "Licences"
        constraints = [
            models.UniqueConstraint(
                fields=["orb", "customer", "customer_user"],
                name="unique_licence_orb_customer_user",
            )
        ]

    objects = LicenceQuerySet.as_manager()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    created = models.DateTimeField(auto_now_add=True, db_index=True)
    modified = models.DateTimeField(auto_now=True, db_index=True)

    orb = models.ForeignKey(
        Orb, related_name="licences", on_delete=models.CASCADE
    )

    customer = models.ForeignKey(
        Customer, related_name="licences", on_delete=models.CASCADE
    )
    customer_user = models.ForeignKey(
        CustomerUser,
        blank=True,
        null=True,
        on_delete=partial(
            CONDITIONAL_CASCADE,
            condition={"orb__is_default": True},
            default_value=None
        ),
        related_name="licences",
    )
    # note the use of CONDITIONAL_CASCADE; if customer_user had a
    # "default" licence then delete it, otherwise just unassign it

    order_item = models.ForeignKey(
        "orbis.OrderItem",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="licences",
    )

    def clean(self):
        # extra validation to ensure that the customer_user belongs to the customer
        # TODO: https://github.com/jazzband/django-smart-selects might also help

        if self.customer_user:
            if self.customer_user.customer != self.customer:
                raise ValidationError(
                    f"The licence user must belong to {self.customer}."
                )
