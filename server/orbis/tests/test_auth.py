import pytest

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.settings import api_settings as drf_settings
from rest_framework.test import APIClient

from astrosat.tests.utils import *

from astrosat_users.models import UserSettings
from astrosat_users.tests.utils import *

from orbis.models import Licence

from .factories import *

UserModel = get_user_model()


@pytest.mark.django_db
class TestOrbisRegistration:
    def test_registration_adds_default_licences(self, user_data, mock_storage):
        """
        Tests that registering a user at the same time as a customer
        creates a customer_user w/ default licences
        """
        default_orb = OrbFactory(is_default=True)
        other_orb = OrbFactory(is_default=False)

        client = APIClient()
        url = reverse("rest_register")

        test_data = {
            "email": user_data["email"],
            "customer_name": "Weyland-Yutani",
            "password1": user_data["password"],
            "password2": user_data["password"],
        }

        response = client.post(url, test_data)
        assert status.is_success(response.status_code)

        user = UserModel.objects.get(email=user_data["email"])
        customer_user = user.customer_users.filter(
            customer__name=test_data["customer_name"]
        )[0]

        assert customer_user.customer_user_type == "MANAGER"
        assert customer_user.customer_user_status == "PENDING"

        licenced_orbs = [licence.orb for licence in Licence.objects.all()]
        assert len(licenced_orbs) == 1
        assert default_orb in licenced_orbs
        assert other_orb not in licenced_orbs

    def test_registration_adds_document_agreements(
        self, user_data, mock_storage
    ):

        user_settings = UserSettings.load()
        user_settings.require_terms_acceptance = True
        user_settings.save()

        terms_document = DocumentFactory(
            type=DocumentType.TERMS, is_active=True
        )
        privacy_document = DocumentFactory(
            type=DocumentType.PRIVACY, is_active=True
        )

        client = APIClient()
        url = reverse("rest_register")

        test_data = {
            "email": user_data["email"],
            "customer_name": "Weyland-Yutani",
            "password1": user_data["password"],
            "password2": user_data["password"],
            "accepted_terms": True,
        }

        response = client.post(url, test_data)
        assert status.is_success(response.status_code)

        user = UserModel.objects.get(email=user_data["email"])
        assert terms_document in user.documents.all()
        assert privacy_document in user.documents.all()

    def test_registration_raises_error_on_missing_documents(
        self, user_data, mock_storage
    ):

        user_settings = UserSettings.load()
        user_settings.require_terms_acceptance = True
        user_settings.save()

        client = APIClient()
        url = reverse("rest_register")

        test_data = {
            "email": user_data["email"],
            "customer_name": "Weyland-Yutani",
            "password1": user_data["password"],
            "password2": user_data["password"],
            "accepted_terms": True,
        }

        response = client.post(url, test_data)
        content = response.json()
        assert status.is_client_error(response.status_code)

        assert content["errors"]["accepted_terms"] == [
            "Cannot find active Terms and Privacy Document"
        ]
        assert UserModel.objects.count() == 0


@pytest.mark.django_db
class TestOrbisLogin:
    def test_login_fails_without_document_agreements(self, mock_storage):
        user_settings = UserSettings.load()
        user_settings.require_terms_acceptance = True
        user_settings.save()

        user = UserFactory(accepted_terms=False)

        DocumentFactory(type=DocumentType.TERMS, is_active=True)
        DocumentFactory(type=DocumentType.PRIVACY, is_active=True)

        client = APIClient()
        url = reverse("rest_login")
        test_data = {
            "email": user.email,
            "password": user.raw_password,
            "accepted_terms": False
        }

        response = client.post(url, test_data)
        content = response.json()
        assert status.is_client_error(response.status_code)

        assert content["errors"] == {
            drf_settings.NON_FIELD_ERRORS_KEY: [
                "Please accept our latest Terms & Conditions and Privacy Policy."
            ]
        }

    def test_login_adds_document_agreements(self, mock_storage):

        user_settings = UserSettings.load()
        user_settings.require_terms_acceptance = True
        user_settings.save()

        user = UserFactory(accepted_terms=False)

        terms_document = DocumentFactory(
            type=DocumentType.TERMS, is_active=True
        )
        privacy_document = DocumentFactory(
            type=DocumentType.PRIVACY, is_active=True
        )

        client = APIClient()
        url = reverse("rest_login")
        test_data = {
            "email": user.email,
            "password": user.raw_password,
            "accepted_terms": True
        }

        response = client.post(url, test_data)
        assert status.is_success(response.status_code)

        user.refresh_from_db()
        assert terms_document in user.documents.all()
        assert privacy_document in user.documents.all()

    def test_login_raises_error_on_missing_documents(self, mock_storage):

        user_settings = UserSettings.load()
        user_settings.require_terms_acceptance = True
        user_settings.save()

        user = UserFactory(accepted_terms=False)

        client = APIClient()
        url = reverse("rest_login")
        test_data = {
            "email": user.email,
            "password": user.raw_password,
            "accepted_terms": True
        }

        response = client.post(url, test_data)
        content = response.json()
        assert status.is_client_error(response.status_code)

        assert content["errors"]["accepted_terms"] == [
            "Cannot find active Terms and Privacy Document"
        ]
