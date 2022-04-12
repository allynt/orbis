from collections import Counter

from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework_gis import serializers as gis_serializers

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
        activity_tuples = [
            tuple(activity.values()) for activity in proposal_activities
        ]
        counts = Counter(activity_tuples)
        duplicates = [key for key in counts.keys() if counts[key] > 1]

        if len(duplicates):
            raise serializers.ValidationError(
                f"Duplicate activities found: {duplicates}"
            )
