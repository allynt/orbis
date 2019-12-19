import pytest
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from django.test import Client
from rest_framework.test import APIClient

from astrosat_users.models import UserSettings
from astrosat_users.serializers import UserSerializer
from astrosat_users.tests.utils import *

from .factories import UserFactory


@pytest.fixture
def admin():
    UserModel = get_user_model()
    admin = UserModel.objects.create_superuser("admin", "admin@admin.com", "password")
    admin.verify()
    return admin


@pytest.fixture
def user():
    user = UserFactory()
    # user.verify()
    return user


@pytest.fixture
def client():
    """
    a client to use w/ the backend
    """
    client = Client(enforce_csrf_checks=False)
    client.force_login(AnonymousUser())
    return client


@pytest.fixture
def api_client(user):
    """
    a client to use w/ the API
    w/ an already logged-in user
    and a valid token & key
    """
    token, key = create_auth_token(user)
    client = APIClient()
    client.force_authenticate(user=user, token=token)
    return (client, user, token, key)


@pytest.fixture
def user_settings():
    user_settings = UserSettings.load()
    return user_settings
