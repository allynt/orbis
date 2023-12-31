import os
import pytest
import urllib

from django.db import transaction
from django.db.utils import IntegrityError
from django.http import FileResponse
from django.urls import resolve, reverse

from rest_framework import status

from astrosat.tests.utils import *

from orbis.models import Document

from .factories import *


@pytest.mark.django_db
class TestDocumentModels:
    def test_cannot_delete_document_with_agreements(self, user, mock_storage):

        test_document = DocumentFactory(
            name="test", type=DocumentType.TERMS, is_active=True
        )

        # cannot delete while user agreed to document...
        user.documents.add(test_document)
        with pytest.raises(IntegrityError):
            test_document.delete()

        # can delete while no user agreed to document...
        user.documents.clear()
        test_document.delete()
        assert not Document.objects.terms().exists()

    def test_unique_constraints(self, mock_storage):

        # same document type cannot have same name and version
        with transaction.atomic():
            user_guide_1 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.GUIDE,
            )
            user_guide_2 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.GUIDE,
            )
            with pytest.raises(IntegrityError):
                user_guide_1.save()
                user_guide_2.save()
        Document.objects.all().delete()

        # same document type can have same name and different version
        with transaction.atomic():
            user_guide_1 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.GUIDE,
            )
            user_guide_2 = DocumentFactory.build(
                name="test",
                version="v2",
                type=DocumentType.GUIDE,
            )
            user_guide_1.save()
            user_guide_2.save()
        Document.objects.all().delete()

        # same document type cannot have same name and different version and is_active
        with transaction.atomic():
            user_guide_1 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.GUIDE,
                is_active=True
            )
            user_guide_2 = DocumentFactory.build(
                name="test",
                version="v2",
                type=DocumentType.GUIDE,
                is_active=True
            )
            with pytest.raises(IntegrityError):
                user_guide_1.save()
                user_guide_2.save()
        Document.objects.all().delete()

        # same document type can have different name and is_active
        with transaction.atomic():
            user_guide_1 = DocumentFactory.build(
                name="test1",
                version=None,
                type=DocumentType.GUIDE,
                is_active=True
            )
            user_guide_2 = DocumentFactory.build(
                name="test2",
                version=None,
                type=DocumentType.GUIDE,
                is_active=True
            )
            user_guide_1.save()
            user_guide_2.save()
        Document.objects.all().delete()

        # different document types can have same name and version
        with transaction.atomic():
            user_guide_1 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.GUIDE,
            )
            privacy_1 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.PRIVACY,
            )
            user_guide_1.save()
            privacy_1.save()
        Document.objects.all().delete()

        # same document type can have same name and version and different orbs
        with transaction.atomic():
            user_guide_orb_1 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.GUIDE,
                orb=OrbFactory(logo=None),
            )
            user_guide_orb_2 = DocumentFactory.build(
                name="test",
                version="v1",
                type=DocumentType.GUIDE,
                orb=OrbFactory(logo=None),
            )
            user_guide_1.save()
            privacy_1.save()
        Document.objects.all().delete()


@pytest.mark.django_db
class TestDocumentViews:
    def test_get_active_document(self, user, api_client, mock_storage):

        user_guide_1 = DocumentFactory(
            name="test", version="v1", type=DocumentType.GUIDE, is_active=True
        )
        user_guide_2 = DocumentFactory(
            name="test", version="v2", type=DocumentType.GUIDE, is_active=False
        )

        client = api_client(user)

        url_params = urllib.parse.urlencode({"type": DocumentType.GUIDE})
        url = f"{reverse('documents')}?{url_params}"

        response = client.get(url)
        assert status.is_success(response.status_code)
        assert os.path.basename(
            user_guide_1.file.name
        ) in response.headers.get("Content-Disposition", "")

    def test_get_active_document_by_name(self, user, api_client, mock_storage):

        user_guide_1 = DocumentFactory(
            name="test1", is_active=True, type=DocumentType.GUIDE
        )
        user_guide_2 = DocumentFactory(
            name="test2", is_active=True, type=DocumentType.GUIDE
        )

        client = api_client(user)

        url_params = urllib.parse.urlencode({
            "type": DocumentType.GUIDE, "name": "test1"
        })
        url = f"{reverse('documents')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        assert os.path.basename(
            user_guide_1.file.name
        ) in response.headers.get("Content-Disposition", "")
