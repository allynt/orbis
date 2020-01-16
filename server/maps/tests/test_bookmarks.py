import itertools
import pytest
import urllib

from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat_users.models import User
from astrosat_users.tests.utils import *

from maps.serializers import BookmarkSerializer

from .factories import *


@pytest.mark.django_db
class TestBookmarkViews:

    def test_list_get(self):

        user = UserFactory()
        _, key = create_auth_token(user)

        bookmarks = [
            BookmarkFactory()
            for _ in range(10)
        ]

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("bookmark-list")
        response = client.get(url)

        assert status.is_success(response.status_code)
        assert len(response.json()) == 10

    def test_detail_get(self):

        user = UserFactory()
        _, key = create_auth_token(user)

        bookmark = BookmarkFactory(owner=user)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("bookmark-detail", kwargs={"pk": bookmark.pk})
        response = client.get(url)

        assert status.is_success(response.status_code)

    def test_detail_delete(self):

        user = UserFactory()
        _, key = create_auth_token(user)

        bookmark = BookmarkFactory(owner=user)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("bookmark-detail", kwargs={"pk": bookmark.pk})
        response = client.delete(url)

        assert status.is_success(response.status_code)

        assert Bookmark.objects.count() == 0

    def test_list_post(self):

        user = UserFactory()
        _, key = create_auth_token(user)

        bookmark_data = BookmarkSerializer(
            BookmarkFactory.build(owner=user)
        ).data

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("bookmark-list")
        response = client.post(url, bookmark_data, format="json")

        assert status.is_success(response.status_code)

        assert Bookmark.objects.count() == 1

    def test_detail_put(self):

        user = UserFactory()
        _, key = create_auth_token(user)

        bookmark = BookmarkFactory(owner=user)
        bookmark_data = BookmarkSerializer(bookmark).data
        old_title = bookmark_data["title"]
        new_title = shuffle_string(old_title).strip()
        bookmark_data["title"] = new_title

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("bookmark-detail", kwargs={"pk": bookmark.pk})
        response = client.put(url, bookmark_data, format="json")

        assert status.is_success(response.status_code)

        bookmark.refresh_from_db()
        assert bookmark.title == new_title

    def test_list_filter(self):

        users = [UserFactory() for _ in range(2)]
        bookmarks = [
            BookmarkFactory(owner=users[i%2])
            for i in range(10)
        ]

        _, key = create_auth_token(users[0])

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url_params = urllib.parse.urlencode({"owner": users[0].pk})
        url = f"{reverse('bookmark-list')}?{url_params}"

        response = client.get(url)
        data = response.json()
        assert status.is_success(response.status_code)
        assert all(d["owner"] == users[0].pk for d in data)
        assert len(data) == 5
        assert Bookmark.objects.count() == 10
