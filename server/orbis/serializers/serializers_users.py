from rest_framework import serializers

from astrosat.serializers import ContextVariableDefault

from orbis.models import OrbisUserProfile, OrbisUserFeedbackRecord


class OrbisUserFeedbackRecordSerializer(serializers.ModelSerializer):
    """
    This is the serializer used just for the OrbisUserFeedbackRecordView
    """
    class Meta:
        model = OrbisUserFeedbackRecord
        fields = [
            "id",
            "timestamp",
            "provided_feedback",
            "source_ids",
            "profile",
        ]

    id = serializers.IntegerField(read_only=True)

    profile = serializers.PrimaryKeyRelatedField(
        default=ContextVariableDefault("profile", raise_error=True),
        queryset=OrbisUserProfile.objects.all(),
        write_only=True,
    )


class OrbisUserFeedbackRecordNestedSerializer(serializers.ModelSerializer):
    """
    This is the default serializer used as nested content w/in the OrbisUserProfileSerializer
    """
    class Meta:
        model = OrbisUserFeedbackRecord
        fields = [
            "id",
            "timestamp",
            "provided_feedback",
            "source_ids",
        ]

    id = serializers.IntegerField(read_only=True)


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

    feedback_records = OrbisUserFeedbackRecordNestedSerializer(
        many=True, read_only=True
    )
