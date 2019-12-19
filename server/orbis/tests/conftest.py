import pytest
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker

from django.contrib.auth import get_user_model

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
