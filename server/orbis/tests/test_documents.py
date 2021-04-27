import os
import pytest
import urllib

from django.db import transaction
from django.db.utils import IntegrityError
from django.http import FileResponse
from django.urls import resolve, reverse

from rest_framework import status

from astrosat.tests.utils import *

from orbis.models import PrivacyDocument, TermsDocument, UserGuideDocument

from .factories import *


@pytest.mark.django_db
class TestDocumentModels:
    def test_unique_constraints(self, mock_storage):

        # same document type cannot have same name and version
        with transaction.atomic():
            user_guide_1 = UserGuideDocumentFactory.build(
                name="test", version="v1"
            )
            user_guide_2 = UserGuideDocumentFactory.build(
                name="test", version="v1"
            )
            with pytest.raises(IntegrityError):
                user_guide_1.save()
                user_guide_2.save()
        UserGuideDocument.objects.all().delete()

        # same document type can have same name and different version
        with transaction.atomic():
            user_guide_1 = UserGuideDocumentFactory.build(
                name="test", version="v1"
            )
            user_guide_2 = UserGuideDocumentFactory.build(
                name="test", version="v2"
            )
            user_guide_1.save()
            user_guide_2.save()
        UserGuideDocument.objects.all().delete()

        # same document type cannot have same name and different version and is_active
        with transaction.atomic():
            user_guide_1 = UserGuideDocumentFactory.build(
                name="test", version="v1", is_active=True
            )
            user_guide_2 = UserGuideDocumentFactory.build(
                name="test", version="v2", is_active=True
            )
            with pytest.raises(IntegrityError):
                user_guide_1.save()
                user_guide_2.save()
        UserGuideDocument.objects.all().delete()

        # same document type can have different name and is_active
        with transaction.atomic():
            user_guide_1 = UserGuideDocumentFactory.build(
                name="test1", version=None, is_active=True
            )
            user_guide_2 = UserGuideDocumentFactory.build(
                name="test2", version=None, is_active=True
            )
            user_guide_1.save()
            user_guide_2.save()
        UserGuideDocument.objects.all().delete()

        # different document types can have same name and version
        with transaction.atomic():
            user_guide_1 = UserGuideDocumentFactory.build(
                name="test", version="v1"
            )
            privacy_1 = PrivacyDocumentFactory.build(name="test", version="v1")
            user_guide_1.save()
            privacy_1.save()
        UserGuideDocument.objects.all().delete()
        PrivacyDocument.objects.all().delete()


@pytest.mark.django_db
class TestDocumentViews:
    def test_get_active_document(self, user, api_client, mock_storage):

        user_guide_1 = UserGuideDocumentFactory(
            name="test", version="v1", is_active=True
        )
        user_guide_2 = UserGuideDocumentFactory(
            name="test", version="v2", is_active=None
        )

        client = api_client(user)

        url = reverse("documents", kwargs={"document_type": "guide"})

        response = client.get(url)
        assert status.is_success(response.status_code)
        assert os.path.basename(
            user_guide_1.file.name
        ) in response.headers.get("Content-Disposition", "")

    def test_get_active_document_by_name(self, user, api_client, mock_storage):

        user_guide_1 = UserGuideDocumentFactory(name="test1", is_active=True)
        user_guide_2 = UserGuideDocumentFactory(name="test2", is_active=True)

        client = api_client(user)

        url_params = urllib.parse.urlencode({"name": "test1"})
        url = f"{reverse('documents', kwargs={'document_type': 'guide'})}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        assert os.path.basename(
            user_guide_1.file.name
        ) in response.headers.get("Content-Disposition", "")
