import pytest

from django.urls import resolve, reverse

from rest_framework import status

from astrosat_users.tests.utils import *

from orbis.models import DataStorage

from .factories import *


@pytest.mark.django_db
class TestSatelliteDataSourceViews:
    def test_satellite_data_source_permission(
        self, customer_user, user, api_client
    ):

        customer_user = customer_user(type="MEMBER")
        data_source = SatelliteDataSourceFactory(customer_user=customer_user)

        # login as somebody other than customer_user.user
        client = api_client(user)
        url = reverse(
            "satellite-data-source-detail",
            kwargs={
                "customer_id": str(customer_user.customer.id),
                "user_id": str(customer_user.user.uuid),
                "datasource_id": str(data_source.id)
            }
        )

        response = client.get(url)
        content = response.json()

        assert status.is_client_error(response.status_code)
        assert content["detail"
                      ] == "You do not have permission to perform this action."

        assert len(DataStorage.objects.all()) == 0

    def test_read_data_source(self, customer_user, api_client):

        customer_user = customer_user(type="MEMBER")
        data_source = SatelliteDataSourceFactory(customer_user=customer_user)

        client = api_client(customer_user.user)
        url = reverse(
            "satellite-data-source-detail",
            kwargs={
                "customer_id": str(customer_user.customer.id),
                "user_id": str(customer_user.user.uuid),
                "datasource_id": str(data_source.id)
            }
        )

        response = client.get(url)
        content = response.json()

        assert status.is_success(response.status_code)

        assert set([
            "source_id",
            "created",
            "name",
            "description",
            "metadata",
            "type",
        ]) == set(
            content.keys()
        )  # assert no write-only fields appear in the output
        assert content["source_id"] == data_source.source_id

        assert len(DataStorage.objects.all()) == 0

    def test_update_data_source(self, customer_user, api_client):

        customer_user = customer_user(type="MEMBER")
        data_source = SatelliteDataSourceFactory(customer_user=customer_user)

        client = api_client(customer_user.user)
        url = reverse(
            "satellite-data-source-detail",
            kwargs={
                "customer_id": str(customer_user.customer.id),
                "user_id": str(customer_user.user.uuid),
                "datasource_id": str(data_source.id)
            }
        )

        response = client.get(url)
        data = response.json()
        data["name"] = "test_name"

        response = client.put(url, data=data, format="json")

        assert status.is_success(response.status_code)
        data_source.refresh_from_db()
        assert data_source.name == "test_name"

        assert len(DataStorage.objects.all()) == 0

    def test_create_data_source(self, customer_user, api_client):

        customer_user = customer_user(type="MEMBER")

        data_source_data = factory.build(
            dict, FACTORY_CLASS=SatelliteDataSourceFactory
        )

        client = api_client(customer_user.user)
        url = reverse(
            "satellite-data-source-list",
            kwargs={
                "customer_id": str(customer_user.customer.id),
                "user_id": str(customer_user.user.uuid)
            }
        )

        response = client.post(url, data=data_source_data)

        assert status.is_success(response.status_code)
        assert SatelliteDataSource.objects.count() == 1
        assert SatelliteDataSource.objects.filter(
            name=data_source_data["name"]
        ).exists()

        data_source = SatelliteDataSource.objects.first()
        assert data_source.customer_user == customer_user

        storage = DataStorage.objects.first()
        assert response.data["name"] == storage.title
