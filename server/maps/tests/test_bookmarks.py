import json
import os
import pytest

from django.test.client import encode_multipart
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import shuffle_string

from astrosat_users.models import User
from astrosat_users.tests.utils import *

from maps.serializers import BookmarkSerializer

from .factories import *

TEST_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

TEST_FORM_BOUNDARY = "----WebKitFormBoundary2QT6fGjSCgRZuMif"

@pytest.mark.django_db
class TestBookmarkViews:

    def test_list_get(self):

        user = UserFactory()
        _, key = create_auth_token(user)

        bookmarks = [
            BookmarkFactory(owner=user)
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

        bookmark = BookmarkFactory.build(owner=user)
        bookmark_data = {
            "title": bookmark.title,
            "description": bookmark.description or "",
            "zoom": bookmark.zoom,
            "center": json.dumps(bookmark.center.coords),
            "feature_collection": json.dumps(bookmark.feature_collection),
            "layers": json.dumps(bookmark.layers),
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("bookmark-list")
        response = client.post(url, bookmark_data, format="multipart")

        assert status.is_success(response.status_code)

        assert Bookmark.objects.count() == 1

    def test_detail_put(self):

        user = UserFactory()
        _, key = create_auth_token(user)

        bookmark = BookmarkFactory.create(owner=user)
        bookmark_data = {
            "title": bookmark.title,
            "description": bookmark.description or "",
            "zoom": bookmark.zoom,
            "center": json.dumps(bookmark.center.coords),
            "feature_collection": json.dumps(bookmark.feature_collection),
            "layers": json.dumps(bookmark.layers),
        }

        old_title = bookmark_data["title"]
        new_title = shuffle_string(old_title).strip()
        bookmark_data["title"] = new_title

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("bookmark-detail", kwargs={"pk": bookmark.pk})
        response = client.put(url, bookmark_data, format="multipart")

        assert status.is_success(response.status_code)

        bookmark.refresh_from_db()
        assert bookmark.title == new_title

    def test_list_filter(self):
        # tests that the BookmarkView only returns bookmarks owned by the user making the request

        users = [UserFactory() for _ in range(2)]
        bookmarks = [
            BookmarkFactory(owner=users[i%2])
            for i in range(10)
        ]

        _, key = create_auth_token(users[0])

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")


        url = reverse('bookmark-list')
        response = client.get(url)
        data = response.json()

        assert status.is_success(response.status_code)
        assert all(d["owner"] == str(users[0].uuid) for d in data)
        assert len(data) == 5
        assert Bookmark.objects.count() == 10


# TODO: MOCK THE SAVE OPERATION
# @pytest.mark.django_db
# class TestBookmarkThumbnails:

#     def test_save_thumbnail(self):

#         bookmark = BookmarkFactory(title="test_bookmark")

#         thumbnail = SimpleUploadedFile(
#             name="test_thumbnail.png",
#             content=open(os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb').read(),
#             content_type='image/png'
#         )
#         bookmark.thumbnail = thumbnail
#         bookmark.save()

#         bookmark.delete()

#         pass
