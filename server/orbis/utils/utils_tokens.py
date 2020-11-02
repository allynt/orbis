import jwt
from collections import defaultdict
from datetime import datetime, timedelta
from itertools import chain

from django.conf import settings
from django.contrib.sites.models import Site
from django.core.exceptions import ValidationError

from astrosat_users.conf import app_settings as astrosat_users_app_settings
from astrosat_users.models import User

from orbis.models import DataScope, Licence


def generate_data_token(user):

    default_data_scopes = {
        "read": [f"orbis-user-{user.id}/*/*/*"],
        "create": [f"orbis-user-{user.id}/*/*/*"],
        "delete": [f"orbis-user-{user.id}/*/*/*"],
    }

    # TODO: RESTRICT customer_user BY customer
    licences = Licence.objects.filter(
        id__in=user.customer_users.values("licences")
    ).select_related("orb")

    restricted_data_scopes = {
        "read": [
            str(scope)
            for scope in DataScope.objects.filter(
                orbs__in=licences.can_read().values_list("orb", flat=True)
            ).distinct()
        ],
        "create": [
            str(scope)
            for scope in DataScope.objects.filter(
                orbs__in=licences.can_create().values_list("orb", flat=True)
            ).distinct()
        ],
        "delete": [
            str(scope)
            for scope in DataScope.objects.filter(
                orbs__in=licences.can_delete().values_list("orb", flat=True)
            ).distinct()
        ],
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
        "exp": datetime.utcnow()
        + timedelta(minutes=settings.DATA_TOKEN_TIMEOUT),  # token expiration time
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
