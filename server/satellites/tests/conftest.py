import pytest
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker

from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from astrosat_users.serializers import UserSerializer
from astrosat_users.tests.utils import *

from orbis.tests.factories import UserFactory


@pytest.fixture
def admin():
    UserModel = get_user_model()
    admin = UserModel.objects.create_superuser(
        "admin", "admin@admin.com", "password"
    )
    admin.verify()
    return admin


@pytest.fixture
def user():
    user = UserFactory()
    return user


@pytest.fixture
def api_client():
    """
    returns a DRF API client w/ a pre-authenticated user
    """
    def _api_client(user):
        _, key = create_auth_token(user)
        client = APIClient()
        client.credentials(
            HTTP_AUTHORIZATION=f"Token {key}", HTTP_ORIGIN="http://localhost"
        )
        return client

    return _api_client
