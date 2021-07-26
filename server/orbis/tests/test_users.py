import json
import pytest
import urllib

from django.urls import resolve, reverse

from rest_framework import status

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from .factories import *


@pytest.mark.django_db
class TestOrbisUserFeedbackRecord:
    def test_add_record_feedback(self, user, api_client):
        """
        tests that adding a feedback record works
        """

        test_feedback_data = factory.build(
            dict, FACTORY_CLASS=OrbisUserFeedbackRecordFactory
        )

        client = api_client(user)
        url = reverse("users-feedback", kwargs={"id": user.uuid})

        assert user.orbis_profile.feedback_records.count() == 0

        response = client.post(url, data=test_feedback_data)
        assert status.is_success(response.status_code)

        assert user.orbis_profile.feedback_records.count() == 1

        feedback = user.orbis_profile.feedback_records.first()
        assert feedback.provided_feedback == test_feedback_data[
            "provided_feedback"]
        assert feedback.source_ids == test_feedback_data["source_ids"]

    def test_add_record_feedback_permission(self, user, api_client):
        """
        tests that another user cannot add a user's feedback
        """

        test_user = UserFactory()
        test_feedback_data = factory.build(
            dict, FACTORY_CLASS=OrbisUserFeedbackRecordFactory
        )

        client = api_client(user)
        url = reverse("users-feedback", kwargs={"id": test_user.uuid})

        response = client.post(url, data=test_feedback_data)
        assert status.is_client_error(response.status_code)

        assert test_user.orbis_profile.feedback_records.count() == 0


@pytest.mark.django_db
class TestOrbisUserProfile:
    def test_put_user(self, api_client):
        """
        Tests that I can update the user, including the user profile
        """

        user = UserFactory(name="before", avatar=None)

        client = api_client(user)
        url = reverse("users-detail", kwargs={"id": user.uuid})
        response = client.get(url)

        assert status.is_success(response.status_code)

        test_user_name = "test user"
        test_user_profile_max_searches = 9999

        user_data = response.json()
        user_profile_data = user_data["profiles"]["orbis_profile"]
        user_data.update({"name": test_user_name})
        user_profile_data.update({
            "max_searches": test_user_profile_max_searches
        })

        response = client.put(url, user_data, format="json")
        assert status.is_success(response.status_code)

        user.refresh_from_db()
        assert user.name == test_user_name
        assert user.orbis_profile.max_searches == test_user_profile_max_searches


@pytest.mark.django_db
class TestOrbisUser:
    def test_user_includes_licenced_orbs(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        (customer_user,
         _) = customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb1 = OrbFactory()
        orb2 = OrbFactory()

        customer.assign_licences(orb1, [customer_user])

        client = api_client(user)
        url = reverse("users-detail", kwargs={"id": user.uuid})

        response = client.get(url)
        content = response.json()

        assert status.is_success(response.status_code)

        licenced_orbs = [x["id"] for x in content["orbs"]]
        assert orb1.id in licenced_orbs
        assert orb2.id not in licenced_orbs
