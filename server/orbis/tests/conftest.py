import pytest
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker

from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from astrosat_users.serializers import UserSerializer
from astrosat_users.tests.utils import *

from .factories import DocumentFactory, UserFactory


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


@pytest.fixture
def user_data():
    """
    Provides a dictionary of user data.
    """

    # rather than use `.build()`, I actually create and then delete the model
    # this is so that the related profile can be created as well

    user = UserFactory(avatar=None)
    serializer = UserSerializer(user)
    data = serializer.data
    data["password"] = user.raw_password

    user.delete()

    return data


@pytest.fixture
def documents():
    """
    Provides correct set of initial documents
    """

    DocumentFactory(
        type="TERMS",
        name="customer_terms",
        orb=None,
        is_active=True,
    )
    DocumentFactory(
        type="TERMS",
        name="user_terms",
        orb=None,
        is_active=True,
    )
    DocumentFactory(
        type="TERMS",
        name="general_terms",
        orb=None,
        is_active=True,
    )
    DocumentFactory(
        type="PRIVACY",
        name="general_privacy",
        orb=None,
        is_active=True,
    )
