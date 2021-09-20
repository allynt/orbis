import pytest

from django.urls import reverse

from rest_framework import status

from orbis.models import DataStorage

from .factories import DataStorageFactory

NO_OF_OBJS = 10


@pytest.mark.django_db
class TestDataStorageViews:
    def test_list_storage(self, user, api_client):
        storage_objs = [
            DataStorageFactory(user=user) for _ in range(NO_OF_OBJS)
        ]

        client = api_client(user)
        url = reverse("datastorage-list")
        response = client.get(url)

        assert status.is_success(response.status_code)

        content = response.data
        assert len(content) == NO_OF_OBJS

    def test_delete_storage(self, user, api_client):
        storage_objs = [
            DataStorageFactory(user=user) for _ in range(NO_OF_OBJS)
        ]
        storage = storage_objs[0]

        assert len(DataStorage.objects.all()) == NO_OF_OBJS

        client = api_client(user)
        url = reverse("datastorage-detail", kwargs={"pk": storage.pk})
        response = client.delete(url)

        assert status.is_success(response.status_code)

        assert len(DataStorage.objects.all()) == NO_OF_OBJS - 1
