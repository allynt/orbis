from collections import Counter

from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework_gis.serializers import GeometryField

from astrosat.views import SwaggerCurrentUserDefault

from orbs.eco_an_alba.models import Proposal


class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = (
            "id",
            "created",
            "modified",
            "name",
            "description",
            "owner",
            "geometry",
            "proposal_description",
            "proposal_start_date",
            "proposal_end_date",
            "proposal_activities",
            "report_state",
        )

    owner = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=get_user_model().objects.all(),
        default=SwaggerCurrentUserDefault(),
    )

    geometry = GeometryField(
        precision=Proposal.PRECISION,
        remove_duplicates=True,
        required=True,
    )

    def validate(self, data):
        validated_data = super().validate(data)

        proposal_start_date = validated_data.get("proposal_start_date")
        proposal_end_date = validated_data.get("proposal_end_date")

        if proposal_start_date and proposal_end_date and proposal_start_date > proposal_end_date:
            raise serializers.ValidationError(
                "Proposal start date must be before proposal end date"
            )

        return validated_data

    def validate_proposal_activities(self, proposal_activities):
        activity_texts = [
            activity.get("title") for activity in proposal_activities
        ]
        activity_duplicates = [
            key for key, value in Counter(activity_texts).items() if value > 1
        ]

        if activity_duplicates:
            raise serializers.ValidationError(
                f"Duplicate activities: {', '.join(activity_duplicates)}"
            )

        return proposal_activities
