import jwt
from collections import defaultdict
from datetime import datetime, timedelta
from enum import IntFlag
from itertools import chain


from django.conf import settings
from django.contrib.sites.models import Site
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.db import models
from django.db.models import Q, F

from astrosat_users.conf import app_settings as astrosat_users_app_settings
from astrosat_users.models import User, UserRole


#############
# token fns #
#############


def generate_data_token(user):

    default_data_scopes = {
        "read": [f"orbis-user-{user.id}/*/*/*"],
        "create": [f"orbis-user-{user.id}/*/*/*"],
        "delete": [f"orbis-user-{user.id}/*/*/*"],
    }

    restricted_data_scopes = {
        "read": [str(scope) for scope in DataScope.objects.can_read(user)],
        "create": [str(scope) for scope in DataScope.objects.can_create(user)],
        "delete": [str(scope) for scope in DataScope.objects.can_delete(user)],
    }

    # clever way of combining default_data_scopes & restricted_data_scopes
    # regardless of which access-flags and/or scopes each dictionary defines
    data_scopes = defaultdict(list)
    for access, scopes in chain.from_iterable(
        map(lambda x: x.items(), (default_data_scopes, restricted_data_scopes))
    ):
        data_scopes[access].extend(scopes)

    payload = {
        "iss": Site.objects.get_current().domain,  # token issuer
        "sub": user.username,  # token subject
        "name": f"{settings.PROJECT_SLUG} token",  # token name
        "iat": datetime.utcnow(),  # token "issued at" time
        "exp": datetime.utcnow() + timedelta(minutes=settings.DATA_TOKEN_TIMEOUT),  # token expiration time
        "scopes": {"data": data_scopes},
    }

    token = jwt.encode(
        payload, settings.DATA_TOKEN_SECRET, algorithm=settings.DATA_TOKEN_ALGORITHM
    )
    return token


def validate_data_token(token):

    try:
        # can token be read...
        payload = jwt.decode(
            token.rstrip(),
            settings.DATA_TOKEN_SECRET,
            algorithms=settings.DATA_TOKEN_ALGORITHM,
        )

        # does user exist...
        username = payload["sub"]
        user = User.objects.get(username=username)
        assert user.is_active, f"{user} is not active."
        if astrosat_users_app_settings.ASTROSAT_USERS_REQUIRE_VERIFICATION:
            assert user.is_verified, f"{user} is not verified."
        if astrosat_users_app_settings.ASTROSAT_USERS_REQUIRE_APPROVAL:
            assert user.is_approved, f"{user} is not approved."

        # has token expired...
        expiration_time = datetime.fromtimestamp(payload["exp"])
        assert datetime.utcnow() <= expiration_time, f"Token has expired."

    except Exception as e:
        raise ValidationError(e)

    return payload


################
# access flags #
################


class Access(IntFlag):
    READ = 1  # 001
    CREATE = 2  # 010
    DELETE = 4  # 100

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


############
# managers #
############


class DataScopeQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def roles(self, roles):
        return self.filter(roles__in=roles)

    def owners(self, users):
        return self.filter(owners__in=users)

    def can_access(self, user):
        # doing this via Q objects is more efficient
        # than using `.intersection()` on the 3 filters above
        return self.filter(
            Q(is_active=True) & (Q(roles__in=user.roles.all()) | Q(owners__in=[user]))
        )

    def can_read(self, user):
        return self.has_access_scope(user, Access.READ)

    def can_create(self, user):
        return self.has_access_scope(user, Access.CREATE)

    def can_delete(self, user):
        return self.has_access_scope(user, Access.DELETE)

    def has_access_scope(self, user, access_scope):

        return (
            self.can_access(user)
            .annotate(
                roleaccess_scope=F("roleaccess__access").bitand(access_scope),
                owneraccess_scope=F("owneraccess__access").bitand(access_scope),
            )
            .filter(
                (Q(roles__isnull=False) & Q(roleaccess_scope__gt=0))
                | (Q(owners__isnull=False) & Q(owneraccess_scope__gt=0))
            )
        )

class DataScopeManager(models.Manager):
    """
    Wrap all of the above DataScopeQuerySet methods
    w/ this DataScopeManager so that I can deserialize using natural_keys
    (this allows me to use fixtures w/out having to hard-code pks)
    """
    def get_by_natural_key(self, source_id):
        kwargs = {
            key: value
            for key, value in zip(["authority", "namespace", "name", "version"], source_id.split("/"))
        }
        instance = self.get(**kwargs)
        return instance

#############
# the model #
#############


class DataScope(models.Model):
    class Meta:
        app_label = "orbis"
        verbose_name = "Orbis Data Scope"
        verbose_name_plural = "Orbis Data Scopes"
        constraints = [
            models.UniqueConstraint(
                fields=["authority", "namespace", "name", "version"],
                name="unique_source_id",
            )
        ]

    objects = DataScopeManager.from_queryset(DataScopeQuerySet)()

    is_active = models.BooleanField(default=True)

    authority = models.CharField(max_length=128, default="*")
    namespace = models.CharField(max_length=128, default="*")
    name = models.CharField(max_length=128, default="*")
    version = models.CharField(max_length=128, default="*")

    roles = models.ManyToManyField(
        UserRole, through="RoleAccess", related_name="data_scopes"
    )
    owners = models.ManyToManyField(
        User, through="OwnerAccess", related_name="data_scopes"
    )
    # subscriptions =

    @property
    def source_id(self):
        return f"{self.authority}/{self.namespace}/{self.name}/{self.version}"

    def __str__(self):
        return self.source_id

    def get_access(self, role=None, user=None):
        """
        A convenience method for getting the appropriate Through Model instance
        """
        assert bool(role) ^ bool(
            user
        ), "DataScope.get_access() takes 'role' XOR 'user'."

        if role is not None:
            access_model = self.roles.through
            access_instance = access_model.objects.get(data_scope=self, role=role)

        elif user is not None:
            access_model = self.owners.through
            access_instance = access_model.objects.get(data_scope=self, owner=user)

        return access_instance

    def natural_key(self):
        # see above comment in DataScopeManager
        return (self.source_id,)


######################
# the through models #
######################


class AccessModel(models.Model):
    class Meta:
        app_label = "orbis"
        abstract = True

    access = models.PositiveIntegerField(
        default=Access.READ, validators=[MaxValueValidator(sum(Access))]
    )

    def _get_access(self, access_scope):
        return self.access & access_scope

    def _add_access(self, access_scope):
        self.access = self.access | access_scope

    def _remove_access(self, access_scope):
        self.access = self.access ^ access_scope

    @property
    def read_access(self):
        return self._get_access(Access.READ)

    @property
    def create_access(self):
        return self._get_access(Access.CREATE)

    @property
    def delete_access(self):
        return self._get_access(Access.DELETE)

    @read_access.setter
    def read_access(self, value):
        if value:
            self._add_access(Access.READ)
        else:
            self._remove_access(Access.READ)

    @create_access.setter
    def create_access(self, value):
        if value:
            self._add_access(Access.CREATE)
        else:
            self._remove_access(Access.CREATE)

    @delete_access.setter
    def delete_access(self, value):
        if value:
            self._add_access(Access.DELETE)
        else:
            self._remove_access(Access.DELETE)


class RoleAccess(AccessModel):
    class Meta:
        app_label = "orbis"
        verbose_name = "Role Access"
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=["data_scope", "role"],
        #         name="unique_role_relationship",
        #     )
        # ]

    data_scope = models.ForeignKey(DataScope, on_delete=models.CASCADE)
    role = models.ForeignKey(UserRole, on_delete=models.CASCADE)


class OwnerAccess(AccessModel):
    class Meta:
        app_label = "orbis"
        verbose_name = "Owner Access"
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=["data_scope", "owner"],
        #         name="unique_owner_relationship",
        #     )
        # ]

    data_scope = models.ForeignKey(DataScope, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
