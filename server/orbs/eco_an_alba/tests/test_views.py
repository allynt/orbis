import pytest
import json

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat_users.tests.utils import *

from .factories import *

@pytest.mark.django_db
class TestProposalViewSet:

    def test_list_proposals(self):
        user = UserFactory()
        _, key = create_auth_token(user)

        proposals = [
            ProposalFactory(owner=user)
            for _ in range(10)
        ]

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("proposal-list")
        response = client.get(url)

        assert status.is_success(response.status_code)
        assert len(response.json()) == 10

    def test_detail_proposal(self):
        user = UserFactory()
        _, key = create_auth_token(user)

        proposal = ProposalFactory(owner=user)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("proposal-detail", kwargs={"pk": proposal.pk})
        response = client.get(url)

        assert status.is_success(response.status_code)

    def test_create_minimal_proposal(self):
        user = UserFactory()
        _, key = create_auth_token(user)

        proposal = ProposalFactory.build(owner=user)
        proposal_data = {
            "created": proposal.created,
            "modified": proposal.modified,
            "name": proposal.name,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("proposal-list")
        response = client.post(url, data=proposal_data, format="json")

        assert status.is_success(response.status_code)

        assert Proposal.objects.count() == 1
        new_proposal = Proposal.objects.first()
        assert new_proposal.name == proposal.name

    def test_create_full_proposal(self):
        user = UserFactory()
        _, key = create_auth_token(user)

        proposal = ProposalFactory.build(owner=user)
        proposal_data = {
            "created": proposal.created,
            "modified": proposal.modified,
            "name": proposal.name,
            "description": proposal.description,
            "proposal_description": proposal.proposal_description,
            "proposal_start_date": proposal.proposal_start_date,
            "proposal_end_date": proposal.proposal_end_date,
            "proposal_activities": proposal.proposal_activities,
            "report_state": proposal.report_state,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("proposal-list")
        response = client.post(url, data=proposal_data, format="json")

        assert status.is_success(response.status_code)

        assert Proposal.objects.count() == 1
        new_proposal = Proposal.objects.first()
        assert new_proposal.name == proposal.name
        assert new_proposal.proposal_description == proposal.proposal_description
        assert new_proposal.report_state == proposal.report_state

    def test_update_proposal(self):
        user = UserFactory()
        _, key = create_auth_token(user)

        proposal = ProposalFactory.create(owner=user)
        proposal_data = {
            "created": proposal.created,
            "modified": proposal.modified,
            "name": proposal.name,
            "description": proposal.description,
            "proposal_description": proposal.proposal_description,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("proposal-detail", kwargs={"pk": proposal.pk})
        response = client.put(url, data=proposal_data, format="json")

        assert status.is_success(response.status_code)

        proposal.refresh_from_db()
        assert proposal.description == proposal_data["description"]
        assert proposal.proposal_description == proposal_data["proposal_description"]

    def test_delete_proposal(self):
        user = UserFactory()
        _, key = create_auth_token(user)

        proposal = ProposalFactory(owner=user)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("proposal-detail", kwargs={"pk": proposal.pk})
        response = client.delete(url)

        assert status.is_success(response.status_code)

        assert Proposal.objects.count() == 0
