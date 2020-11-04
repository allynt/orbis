import pytest
import urllib

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from orbis.utils import generate_data_token, validate_data_token

from .factories import *
from .utils import *


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
        license = LicenceFactory(
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
            LicenceFactory(
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


@pytest.mark.django_db
class TestDataSourceView:

    SOURCE_ID_PARTS = ["authority", "namespace", "name", "version"]

    def test_adds_orb_info(self, user, api_client, mock_data_sources, mock_storage):
        """
        tests that the correct orbs are associated w/ the returned datasources
        """

        source_id = "test/test/test/test"
        mock_data_sources([source_id])
        data_scope = DataScopeFactory(**{part: "test" for part in self.SOURCE_ID_PARTS})

        orb_1 = OrbFactory(data_scopes=[data_scope])
        orb_2 = OrbFactory(data_scopes=[data_scope])

        customer = CustomerFactory(logo=None)
        customer.add_user(user)

        client = api_client(user)
        url = reverse("datasources")

        # user has a licence to 1 orb; there should be 1 object returned...
        customer.assign_licences(orb_1, customer.customer_users.all())
        response = client.get(url, {}, format="json")
        content = response.json()

        source_orbis_metadata = content["sources"][0]["metadata"]["application"]["orbis"]
        sorted_orb_content = sorted(source_orbis_metadata["orbs"], key=lambda x: x["name"])
        assert len(source_orbis_metadata["orbs"]) == 1
        assert sorted_orb_content[0]["name"] == orb_1.name
        assert sorted_orb_content[0]["description"] == orb_1.description

        # user has a licence to 2 orbs; there should be 2 objects returned...
        customer.assign_licences(orb_2, customer.customer_users.all())
        response = client.get(url, {}, format="json")
        content = response.json()

        source_orbis_metadata = content["sources"][0]["metadata"]["application"]["orbis"]
        sorted_orb_content = sorted(source_orbis_metadata["orbs"], key=lambda x: x["name"])
        assert len(source_orbis_metadata["orbs"]) == 2
        assert sorted_orb_content[0]["name"] == orb_1.name
        assert sorted_orb_content[0]["description"] == orb_1.description
        assert sorted_orb_content[1]["name"] == orb_2.name
        assert sorted_orb_content[1]["description"] == orb_2.description

    def test_num_queries(self, user, api_client, mock_data_sources, mock_storage, django_assert_num_queries):
        """
        Tests that a minimal number of queries is run;
        Proves complexity of DataSourceView is constant.
        """

        N_SOURCES = 100
        # N_QUERIES = 114
        N_QUERIES = 16

        source_ids = [
            f"authority/namespace/name/version{i}"
            for i in range(N_SOURCES)
        ]

        data_scope = DataScopeFactory(authority="authority", namespace="namespace", name="name", version="*")

        # (worst-case-scenario: 1 orb per source)
        orbs = [OrbFactory(data_scopes=[data_scope]) for _ in source_ids]

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user)
        for orb in orbs:
            customer.assign_licences(orb, [customer_user])

        mock_data_sources(source_ids)

        client = api_client(user)
        url = reverse("datasources")

        with django_assert_num_queries(N_QUERIES):
            client.get(url, {}, format="json")
