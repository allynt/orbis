import pytest

from orbs.eco_an_alba.tests.factories import ProposalFactory, UserFactory

from orbs.eco_an_alba.models import Proposal
from orbs.eco_an_alba.serializers import ProposalSerializer

@pytest.mark.django_db
class TestProposalSerializer:

    def test_proposal_serialization(self):
        user = UserFactory()
        proposal = ProposalFactory(owner=user)
        print(f"Factory: {proposal}\n\n", flush=True)

        serializer = ProposalSerializer(proposal)
        print(f"Serializer: {serializer.data}", flush=True)

        assert proposal.name == serializer.data["name"]

    def test_proposal_deserialization(self):
        proposal = ProposalFactory.build(owner=UserFactory())
        proposal_data = {
            "created": proposal.created,
            "modified": proposal.modified,
            "name": proposal.name,
            "owner": proposal.owner.uuid,
        }

        serializer = ProposalSerializer(data=proposal_data)
        assert serializer.is_valid()
        print(f"Serializer VALIDATED DATA: {serializer.validated_data}", flush=True)

        assert serializer.validated_data["name"] == proposal.name

    def test_proposal_start_date_after_end_date(self):
        proposal = ProposalFactory.build(owner=UserFactory())
        proposal_data = {
            "created": proposal.created,
            "modified": proposal.modified,
            "name": proposal.name,
            "owner": proposal.owner.uuid,
            "proposal_start_date": "2020-01-01T00:00:00.000Z",
            "proposal_end_date": "2019-01-01T00:00:00.000Z",
        }

        serializer = ProposalSerializer(data=proposal_data)
        assert not serializer.is_valid()
        assert serializer.errors['non_field_errors'][0] == "Proposal start date must be before proposal end date"

    def test_proposal_duplicate_activities(self):
        proposal = ProposalFactory.build(owner=UserFactory())
        proposal_data = {
            "created": proposal.created,
            "modified": proposal.modified,
            "name": proposal.name,
            "owner": proposal.owner.uuid,
            "proposal_activities": ["activity1", "activity1"],
        }

        serializer = ProposalSerializer(data=proposal_data)
        assert not serializer.is_valid()
        assert serializer.errors['proposal_activities'][0] == "Proposal activities cannot contain duplicates: ['activity1']"
