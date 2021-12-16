import pytest

from django.urls import resolve, reverse

from rest_framework import status

from astrosat_users.tests.utils import *

from orbis.models import DataStorage
from orbis.tests.factories import DataStorageFactory

from .factories import *


@pytest.mark.django_db
class TestSatelliteDataSource:
    def test_filter_by_user(self, customer_user):
        customer_user_1 = customer_user()
        customer_user_2 = customer_user()

        data_source_1 = SatelliteDataSourceFactory(
            customer_user=customer_user_1
        )

        data_source_2 = SatelliteDataSourceFactory(
            customer_user=customer_user_2
        )

        data_source_qs = SatelliteDataSource.objects.filter_by_user(
            customer_user_1.user
        )
        assert data_source_1 in data_source_qs
        assert data_source_2 not in data_source_qs

    def test_filter_by_storage(self, customer_user):
        """
            Tests that I can filter StoredDataSources based on DataStorage 1to1 relations
            """
        customer_user = customer_user()
        data_storage = DataStorageFactory(
            customer=customer_user.customer, user=customer_user.user
        )
        data_source = SatelliteDataSourceFactory(
            customer_user=customer_user, data_storage=data_storage
        )

        data_storage.status = DataStorage.DataStorageStatus.PENDING
        data_storage.save()
        assert data_source in SatelliteDataSource.objects.pending()
        assert data_source not in SatelliteDataSource.objects.active()
        assert data_source not in SatelliteDataSource.objects.archived()

        data_storage.status = DataStorage.DataStorageStatus.ACTIVE
        data_storage.save()
        assert data_source not in SatelliteDataSource.objects.pending()
        assert data_source in SatelliteDataSource.objects.active()
        assert data_source not in SatelliteDataSource.objects.archived()

        data_storage.status = DataStorage.DataStorageStatus.ARCHIVED
        data_storage.save()
        assert data_source not in SatelliteDataSource.objects.pending()
        assert data_source not in SatelliteDataSource.objects.active()
        assert data_source in SatelliteDataSource.objects.archived()


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

        response = client.get(url, format="json")
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

        response = client.get(url, format="json")
        content = response.json()

        assert status.is_success(response.status_code)

        assert set([
            "source_id",
            "created",
            "name",
            "description",
            "type",
            "metadata",
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

        response = client.get(url, format="json")
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

        response = client.post(url, data=data_source_data, format="json")

        assert status.is_success(response.status_code)
        assert SatelliteDataSource.objects.count() == 1
        assert SatelliteDataSource.objects.filter(
            name=data_source_data["name"]
        ).exists()

        data_source = SatelliteDataSource.objects.first()
        assert data_source.customer_user == customer_user

        storage = DataStorage.objects.first()
        assert response.data["name"] == storage.title

    def test_create_data_source_fails_without_satellite_ids(
        self, customer_user, api_client
    ):

        customer_user = customer_user(type="MEMBER")

        data_source_data = factory.build(
            dict, FACTORY_CLASS=SatelliteDataSourceFactory
        )
        data_source_data.pop("satellite_id")
        data_source_data.pop("scene_id")
        data_source_data.pop("visualisation_id")

        client = api_client(customer_user.user)
        url = reverse(
            "satellite-data-source-list",
            kwargs={
                "customer_id": str(customer_user.customer.id),
                "user_id": str(customer_user.user.uuid)
            }
        )

        response = client.post(url, data=data_source_data, format="json")

        assert status.is_client_error(response.status_code)
        assert SatelliteDataSource.objects.count() == 0
        assert DataStorage.objects.count() == 0
