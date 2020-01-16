# import pytest
# import factory
# from factory.faker import (
#     Faker as FactoryFaker,
# )  # note I use FactoryBoy's wrapper of Faker

# from django.contrib.auth import get_user_model

# from astrosat_users.tests.utils import *

# from .factories import UserFactory


# @pytest.fixture
# def admin():
#     UserModel = get_user_model()
#     admin = UserModel.objects.create_superuser("admin", "admin@admin.com", "password")
#     admin.verify()
#     return admin


# @pytest.fixture
# def user():
#     user = UserFactory()
#     return user

# @pytest.fixture
# def user_data():
#     """
#     Provides a dictionary of user data.
#     """

#     # rather than use `.build()`, I actually create and then delete the model
#     # this is so that the related profile can be created as well

#     user = UserFactory()
#     serializer = UserSerializer(user)
#     data = serializer.data
#     data["password"] = user.raw_password

#     user.delete()

#     return data
