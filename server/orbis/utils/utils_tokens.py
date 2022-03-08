import jwt
from collections import defaultdict
from datetime import datetime, timedelta
import functools
from itertools import chain
from operator import __or__ as or_fn

from django.conf import settings
from django.contrib.sites.models import Site
from django.core.exceptions import ValidationError

from astrosat_users.conf import app_settings as astrosat_users_app_settings
from astrosat_users.models import User
from astrosat_users.serializers import UserSerializer

from orbis.models import DataScope, Licence


def chunk_data_scopes(data_scopes, chunk_size=None):
    """
    iterates over data_scopes returning successive dicts
    each w/ no more than chunk_size values
    """

    n_values = 0
    chunked_data_scopes = defaultdict(list)
    for access, scopes in data_scopes.items():
        for scope in scopes:
            chunked_data_scopes[access].append(scope)
            n_values += 1
            if n_values == chunk_size:
                yield chunked_data_scopes
                chunked_data_scopes = defaultdict(list)
                n_values = 0
    yield chunked_data_scopes


def generate_data_scopes(user):

    default_data_scopes = {
        "read": [f"orbis-user-{user.id}/*/*/*"],
        "create": [f"orbis-user-{user.id}/*/*/*"],
        "delete": [f"orbis-user-{user.id}/*/*/*"],
        "update": [],
    }

    # TODO: RESTRICT customer_user BY customer
    licences = Licence.objects.filter(
        id__in=user.customer_users.values("licences")
    ).select_related("orb")

    restricted_data_scopes = {
        "read":
            DataScope.objects.filter(
                orbs__in=licences.can_read().values_list("orb", flat=True)
            ).distinct(),
        "create":
            DataScope.objects.filter(
                orbs__in=licences.can_create().values_list("orb", flat=True)
            ).distinct(),
        "delete":
            DataScope.objects.filter(
                orbs__in=licences.can_delete().values_list("orb", flat=True)
            ).distinct(),
        "update":
            DataScope.objects.filter(
                orbs__in=licences.can_update().values_list("orb", flat=True)
            ).distinct(),
    }

    # clever way of combining default_data_scopes & restricted_data_scopes
    # regardless of which access-flags and/or scopes each dictionary defines
    data_scopes = defaultdict(list)
    for access, scopes in chain.from_iterable(
        map(lambda x: x.items(), (default_data_scopes, restricted_data_scopes))
    ):
        data_scopes[access].extend([str(scope) for scope in scopes])

    # application-specific scopes go here...
    # yapf: disable

    # any customer MANAGER w/ access to "A4H" data can also download that data
    a4h_data_scopes = functools.reduce(
        or_fn, restricted_data_scopes.values()
    ).filter(applications__overlap=["a4h", "A4H"])
    if a4h_data_scopes.exists() and user.customer_users.active().managers().exists():
        data_scopes["download"].extend([str(scope) for scope in a4h_data_scopes])

    return data_scopes


def generate_data_token(user, data_scopes=None):

    if data_scopes is None:
        data_scopes = generate_data_scopes(user)

    payload = {
        "iss": Site.objects.get_current().domain,  # token issuer
        "sub": user.username,  # token subject
        "name": f"{settings.PROJECT_SLUG} token",  # token name
        "iat": datetime.utcnow(),  # token "issued at" time
        "exp": datetime.utcnow() + timedelta(minutes=settings.DATA_TOKEN_TIMEOUT),  # token expiration time
        "scopes": {"data": data_scopes},
    }  # yapf: disable

    token = jwt.encode(
        payload,
        settings.DATA_TOKEN_SECRET,
        algorithm=settings.DATA_TOKEN_ALGORITHM
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
