import jwt
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.sites.models import Site
from django.db import models
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _

from astrosat_users.models import User, UserRole, UserPermission


"""
This contains code for tracking the accessibility of data based on users and roles
(and eventually subscriptions)
It also contains code for generating JWT tokens to encode that accessibility
"""


def generate_data_token(user):

    # each scope is comprised of "<authority>/<namespace>/<name>/<version>"

    default_read_scopes = [
        f"orbis-user-{user.id}/*/*/*",
        "astrosat/core/*/*",
    ]
    default_create_scopes = [
        f"orbis-user-{user.id}/*/*/*",
    ]
    default_delete_scopes = [
        f"orbis-user-{user.id}/*/*/*",
    ]

    user_scopes = DataScope.objects.can_access(user)
    user_read_scopes = [str(scope) for scope in user_scopes.can_read()]
    user_create_scopes = [str(scope) for scope in user_scopes.can_create()]
    user_delete_scopes = [str(scope) for scope in user_scopes.can_delete()]

    payload = {
        "iss": Site.objects.get_current().domain,  # token issuer
        "sub": user.username,  # token subject
        "name": f"{settings.PROJECT_SLUG} token",  # token name
        "iat": datetime.utcnow(),  # token "issued at" time
        "exp": datetime.utcnow() + timedelta(hours=1),  # token expiration time
        "scopes": {
            "data": {
                "read": default_read_scopes + user_read_scopes,
                "create": default_create_scopes + user_create_scopes,
                "delete": default_delete_scopes + user_delete_scopes,
            }
        },
    }

    token = jwt.encode(
        payload, settings.DATA_TOKEN_SECRET_KEY, algorithm=settings.DATA_TOKEN_ALGORITHM
    )
    return token


def validate_data_token(token):

    # can token be read...
    payload = jwt.decode(
        token.rstrip(),
        settings.DATA_TOKEN_SECRET_KEY,
        algorithms=settings.DATA_TOKEN_ALGORITHM,
    )

    # does user exist...
    username = payload["sub"]
    user = User.objects.get(username=username)
    assert user.is_active, f"{user} is not active."

    # has token expired...
    expiration_time = datetime.fromtimestamp(payload["exp"])
    assert datetime.utcnow() <= expiration_time, f"Token has expired."

    return payload


class DataScopeQuerySet(models.QuerySet):

    def active(self):
        return self.filter(is_active=True)

    def roles(self, roles):
        return self.filter(Q(roles__in=roles) | Q(roles=None))

    def owners(self, users):
        return self.filter(Q(owners__in=users) | Q(owners=None))

    def can_access(self, user):
        # doing this via Q objects is more efficient
        # than using `.intersection()` on the 3 filters above
        return self.filter(
            Q(is_active=True)
            & (Q(roles__in=user.roles.all()) | Q(roles=None))
            & (Q(owners__in=[user]) | Q(owners=None))
        )

    def can_read(self):
        return self.filter(
            (Q(roles__isnull=False) & Q(datascoperoleaccess__read=True))
            | (Q(owners__isnull=False) & Q(datascopeowneraccess__read=True))
        )

    def can_create(self):
        return self.filter(
            (Q(roles__isnull=False) & Q(datascoperoleaccess__create=True))
            | (Q(owners__isnull=False) & Q(datascopeowneraccess__create=True))        )

    def can_delete(self):
        return self.filter(
            (Q(roles__isnull=False) & Q(datascoperoleaccess__delete=True))
            | (Q(owners__isnull=False) & Q(datascopeowneraccess__delete=True))        )


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

    objects = DataScopeQuerySet.as_manager()

    is_active = models.BooleanField(default=True)

    authority = models.CharField(max_length=128, default="*")
    namespace = models.CharField(max_length=128, default="*")
    name = models.CharField(max_length=128, default="*")
    version = models.CharField(max_length=128, default="*")

    roles = models.ManyToManyField(
        UserRole, through="DataScopeRoleAccess", related_name="data_scopes"
    )
    owners = models.ManyToManyField(
        User, through="DataScopeOwnerAccess", related_name="data_scopes"
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
        assert bool(role) ^ bool(user), "DataScope.get_access() takes 'role' XOR 'user'."

        if role is not None:
            access_model = self.roles.through
            access_instance = access_model.objects.get(data_scope=self, role=role)

        elif user is not None:
            access_model = self.owners.through
            access_instance = access_model.objects.get(data_scope=self, owner=user)

        return access_instance


class DataScopeAccess(models.Model):
    class Meta:
        app_label = "orbis"
        abstract = True

    read = models.BooleanField(default=True)
    create = models.BooleanField(default=False)
    delete = models.BooleanField(default=False)


class DataScopeRoleAccess(DataScopeAccess):
    class Meta:
        app_label = "orbis"

    data_scope = models.ForeignKey(DataScope, on_delete=models.CASCADE)
    role = models.ForeignKey(UserRole, on_delete=models.CASCADE)


class DataScopeOwnerAccess(DataScopeAccess):
    class Meta:
        app_label = "orbis"

    data_scope = models.ForeignKey(DataScope, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
