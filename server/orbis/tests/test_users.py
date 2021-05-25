import json
import pytest
import urllib

from django.urls import resolve, reverse

from rest_framework import status

from astrosat_users.tests.utils import *

# from astrosat_users.serializers import UserSerializer
# from orbis.serializers import OrbisUserProfileSerializer

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
        tests that another user cannot add a user's feedback of the OrbisUserProfile are serialized along w/ the user
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
