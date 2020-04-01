import itertools
import pytest
import urllib

from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat_users.models import User
from astrosat_users.tests.utils import *

from orbis.models import DataScope, generate_data_token, validate_data_token

from .factories import *


@pytest.mark.django_db
class TestTokens:
    """
    testing the data token generation
    (not testing the authentication token system)
    """

    def test_generate_token_view(self):

        user = UserFactory()

        _, key = create_auth_token(user)

        client = APIClient()
        url = reverse("token")

        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        response = client.get(url)
        assert status.is_success(response.status_code)
        assert "token" in response.json()

    def test_consume_token_view(self, admin):

        user = UserFactory()
        _, user_key = create_auth_token(user)
        _, admin_key = create_auth_token(admin)

        client = APIClient()
        url = reverse("token")

        client.credentials(HTTP_AUTHORIZATION=f"Token {user_key}")

        response = client.get(url)
        valid_token = response.json()["token"]
        invalid_token = shuffle_string(valid_token)

        client.credentials(HTTP_AUTHORIZATION=f"Token {admin_key}")

        # an invalid token fails...
        response = client.post(url, {"token": invalid_token})
        assert status.is_server_error(response.status_code)

        # a valid token & valid user succeeds...
        response = client.post(url, {"token": valid_token})
        assert status.is_success(response.status_code)

        # a valid token & invalid user fails...
        user.is_active = False
        user.save()
        response = client.post(url, {"token": valid_token})
        assert status.is_server_error(response.status_code)

    def test_generate_token_correct_data_access(self, user):

        data_scope = DataScopeFactory()
        data_scope.owners.add(user, through_defaults={"access": 0})
        data_scope_access = data_scope.get_access(user=user)

        data_scope_id = data_scope.source_id

        payload = validate_data_token(generate_data_token(user))
        data_scopes = payload["scopes"]["data"]

        assert data_scope_id not in data_scopes["read"]
        assert data_scope_id not in data_scopes["create"]
        assert data_scope_id not in data_scopes["delete"]

        data_scope_access.read_access = True
        data_scope_access.save()

        payload = validate_data_token(generate_data_token(user))
        data_scopes = payload["scopes"]["data"]

        assert data_scope_id in data_scopes["read"]
        assert data_scope_id not in data_scopes["create"]
        assert data_scope_id not in data_scopes["delete"]

        data_scope_access.create_access = True
        data_scope_access.save()

        payload = validate_data_token(generate_data_token(user))
        data_scopes = payload["scopes"]["data"]

        assert data_scope_id in data_scopes["read"]
        assert data_scope_id in data_scopes["create"]
        assert data_scope_id not in data_scopes["delete"]

        data_scope_access.delete_access = True
        data_scope_access.save()

        payload = validate_data_token(generate_data_token(user))
        data_scopes = payload["scopes"]["data"]

        assert data_scope_id in data_scopes["read"]
        assert data_scope_id in data_scopes["create"]
        assert data_scope_id in data_scopes["delete"]


@pytest.mark.django_db
class TestDataScopes:

    # COMMENTING THIS OUT UNTIL I MANAGE TO MOCK THE data-sources-directory SERVER
    # def test_get_sources_view(self):

    #     user = UserFactory()

    #     _, key = create_auth_token(user)

    #     client = APIClient()
    #     url = reverse("data")

    #     client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

    #     response = client.get(url)
    #     assert status.is_success(response.status_code)
    #     assert "token" in response.json()
    #     assert "sources" in response.json()

    def test_data_sources_manager_roles(self):

        roles = [UserRoleFactory() for _ in range(2)]
        data_scopes = [DataScopeFactory() for _ in range(4)]

        # each data_source has the corresponding role
        # (except where they don't b/c there are an uneven number of models)
        for role, data_scope in itertools.zip_longest(roles, data_scopes):
            if data_scope and role:
                data_scope.roles.add(role)

        assert DataScope.objects.roles(roles[0:1]).count() == 1
        assert DataScope.objects.roles(roles[1:2]).count() == 1
        assert DataScope.objects.roles(roles[0:2]).count() == 2
        assert DataScope.objects.roles([]).count() == 0

    def test_data_sources_manager_owners(self):

        users = [UserFactory() for _ in range(2)]
        data_scopes = [DataScopeFactory() for _ in range(4)]

        # each data_source has the corresponding owner
        # (except where they don't b/c there are an uneven number of models)
        for user, data_scope in itertools.zip_longest(users, data_scopes):
            if data_scope and user:
                data_scope.owners.add(user)

        assert DataScope.objects.owners(users[0:1]).count() == 1
        assert DataScope.objects.owners(users[1:2]).count() == 1
        assert DataScope.objects.owners(users[0:2]).count() == 2
        assert DataScope.objects.owners([]).count() == 0

    def test_data_sources_manager_access(self):

        roles = [UserRoleFactory() for _ in range(2)]
        users = [UserFactory() for _ in range(5)]
        data_scopes = [DataScopeFactory() for _ in range(5)]

        # each user has the corresponding role
        # (except where they don't b/c there are an uneven number of models)
        for role, user in itertools.zip_longest(roles, users):
            if role and user:
                user.roles.add(role)

        # data_scope 0 has role 0
        data_scopes[0].roles.add(roles[0])

        # data_scope 1 has role 1
        data_scopes[1].roles.add(roles[1])

        # data_scope 2 has owner 2
        data_scopes[2].owners.add(users[2])

        # data_scope 3 has owner 3
        data_scopes[3].owners.add(users[3])

        # data_scope 4 has role 0 and owner 2
        data_scopes[4].roles.add(roles[0])
        data_scopes[4].owners.add(users[2])

        user_0_scopes = set(
            DataScope.objects.can_access(users[0]).values_list("id", flat=True)
        )
        assert user_0_scopes == set([data_scopes[0].pk, data_scopes[4].pk])

        user_1_scopes = set(
            DataScope.objects.can_access(users[1]).values_list("id", flat=True)
        )
        assert user_1_scopes == set([data_scopes[1].pk])

        user_2_scopes = set(
            DataScope.objects.can_access(users[2]).values_list("id", flat=True)
        )
        assert user_2_scopes == set([data_scopes[2].pk, data_scopes[4].pk])

        user_3_scopes = set(
            DataScope.objects.can_access(users[3]).values_list("id", flat=True)
        )
        assert user_3_scopes == set([data_scopes[3].pk])

        user_4_scopes = set(
            DataScope.objects.can_access(users[4]).values_list("id", flat=True)
        )
        assert user_4_scopes == set([])
