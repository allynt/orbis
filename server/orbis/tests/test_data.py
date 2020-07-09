import pytest
import urllib

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from orbis.utils import generate_data_token, validate_data_token

from .factories import *


@pytest.mark.django_db
class TestTokens:
    """
    testing the data token generation
    (not testing the authentication token system)
    """

    def test_generate_token_view(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user)
        orb = OrbFactory(data_scopes=[DataScopeFactory()])
        license = LicenseFactory(
            customer=customer,
            orb=orb,
            customer_user=customer_user,
            access=Access.READ + Access.CREATE + Access.DELETE,
        )

        client = api_client(user)
        url = reverse("token")
        response = client.get(url)

        assert status.is_success(response.status_code)
        assert "token" in response.json()

    def test_consume_token_view(self, user, admin, mock_storage):

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

    def test_generate_token_correct_data_access(self, user, api_client, mock_storage):

        access_scopes = [Access.READ, Access.CREATE, Access.DELETE]

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user)
        data_scopes = [DataScopeFactory() for _ in access_scopes]
        orbs = [OrbFactory(data_scopes=[data_scope]) for data_scope in data_scopes]

        for i, access_scope in enumerate(access_scopes):
            LicenseFactory(
                customer=customer,
                orb=orbs[i],
                customer_user=customer_user,
                access=access_scope,
            )

        # orb[0] has data_scope[0]
        # orb[1] has data_scope[1]
        # orb[2] has data_scope[2]
        # license[0] has READ access to orb[0].data_scopes
        # license[1] has CREATE access to orb[1].data_scopes
        # license[2] has DELETE access to orb[2].data_scopes

        payload = validate_data_token(generate_data_token(user))
        payload_data_scopes = payload["scopes"]["data"]

        assert data_scopes[0].source_id_pattern in payload_data_scopes["read"]
        assert data_scopes[0].source_id_pattern not in payload_data_scopes["create"]
        assert data_scopes[0].source_id_pattern not in payload_data_scopes["delete"]

        assert data_scopes[1].source_id_pattern not in payload_data_scopes["read"]
        assert data_scopes[1].source_id_pattern in payload_data_scopes["create"]
        assert data_scopes[1].source_id_pattern not in payload_data_scopes["delete"]

        assert data_scopes[2].source_id_pattern not in payload_data_scopes["read"]
        assert data_scopes[2].source_id_pattern not in payload_data_scopes["create"]
        assert data_scopes[2].source_id_pattern in payload_data_scopes["delete"]
