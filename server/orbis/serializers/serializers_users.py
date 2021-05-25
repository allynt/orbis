from rest_framework import serializers

from astrosat.serializers import ContextVariableDefault

from orbis.models import OrbisUserProfile, OrbisUserFeedbackRecord


class OrbisUserFeedbackRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrbisUserFeedbackRecord
        fields = [
            "timestamp",
            "provided_feedback",
            "source_ids",
            "profile",
        ]

    profile = serializers.PrimaryKeyRelatedField(
        default=ContextVariableDefault("profile", raise_error=True),
        queryset=OrbisUserProfile.objects.all(),
        write_only=True,
    )


class OrbisUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrbisUserProfile
        fields = [
            "onboarded",
            "units",
            "region",
            "max_searches",
            "max_results",
            "feedback_records",
        ]

    feedback_records = OrbisUserFeedbackRecordSerializer(many=True)
