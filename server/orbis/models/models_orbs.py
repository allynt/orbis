from enum import IntFlag
import uuid

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.db import models
from django.db.models import Q, F
from django.utils.html import mark_safe

from astrosat_users.models import Customer, CustomerUser


"""
models_orbs includes all the classes used to define:

* Orbs - a thematic collection of data & functionality; a "product"
* DataScopes - a pattern defining which data from *data-sources-directory* can be accessed
* Licence - a way to map orbs to Customers (and CustomerUsers); a "subscription"
* Access - a clever little model to encode the access type for a given Licence

An orb can contain multiple data_scopes.  A licence refers to a single orb.

A JWT is created for a user based on the licences held by that user.

A user can only hold a licence if it is owned by that  user's customer (and not in use by another user).

"""

###########
# helpers #
###########


class Access(IntFlag):
    READ = 1  # 001
    CREATE = 2  # 010
    DELETE = 4  # 100

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

    def has_access_scope(self, access_scope):
        return self.access & access_scope


########################
# managers & querysets #
########################


class OrbManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class OrbQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)


class LicenceQuerySet(models.QuerySet):

    def private(self):
        # CustomerSerializer & CustomerUserSerializer exclude "core" licences
        # the private/public methods make it easier for me to do that
        return self.filter(orb__name="core")

    def public(self):
        # returns the licences that shouldn't be exluded from serialization
        return self.exclude(orb__name="core")

    def purchased(self):
        # returns all licences (just defined for symmetry w/ the frontend)
        return self

    def active(self):
        # returns all licences that have been assigned to a user
        return self.filter(customer_user__isnull=False)

    def available(self):
        # returns all licence that have not been assigned to a user
        return self.filter(customer_user__isnull=True)

    def can_read(self):
        return self.has_access_scope(Access.READ)

    def can_create(self):
        return self.has_access_scope(Access.CREATE)

    def can_delete(self):
        return self.has_access_scope(Access.DELETE)

    def has_access_scope(self, access_scope):
        return self.annotate(can_access=F("access").bitand(access_scope)).filter(
            can_access__gte=1
        )


class DataScopeManager(models.Manager):
    def get_by_natural_key(self, source_id_pattern):
        kwargs = {
            key: value
            for key, value in zip(
                ["authority", "namespace", "name", "version"],
                source_id_pattern.split("/"),
            )
        }
        instance = self.get(**kwargs)
        return instance


class DataScopeQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)


##########
# models #
##########


class Orb(models.Model):
    class Meta:
        app_label = "orbis"
        verbose_name = "Orb"
        verbose_name_plural = "Orbs"

    objects = OrbManager.from_queryset(OrbQuerySet)()

    name = models.CharField(max_length=128, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    @classmethod
    def get_core_orb(cls):
        core_orb, orb_created = cls.objects.get_or_create(name="core")
        if orb_created:
            core_data_scope, _ = DataScope.objects.get_or_create(
                authority="astrosat",
                namespace="core",
                name="*",
                version="*",
            )
            core_orb.data_scopes.add(core_data_scope)
        return core_orb

    def natural_key(self):
        return (self.name,)


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

    orb = models.ForeignKey(Orb, related_name="licences", on_delete=models.CASCADE)

    customer = models.ForeignKey(
        Customer, related_name="licences", on_delete=models.CASCADE
    )
    customer_user = models.ForeignKey(
        CustomerUser,
        blank=True,
        null=True,
        related_name="licences",
        on_delete=models.SET_NULL,
    )  # note that despite `on_delete=models.SET_NULL`, the pre-delete signal will delete the "core" Licence

    def clean(self):
        # extra validation to ensure that the customer_user belongs to the customer
        # TODO: https://github.com/jazzband/django-smart-selects might also help

        if self.customer_user:
            if self.customer_user.customer != self.customer:
                raise ValidationError(
                    f"The licence user must belong to {self.customer}."
                )


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

    def __str__(self):
        return self.source_id_pattern

    @property
    def source_id_pattern(self):
        return f"{self.authority}/{self.namespace}/{self.name}/{self.version}"

    def natural_key(self):
        return (self.source_id_pattern,)
