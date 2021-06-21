from rest_framework import serializers

from astrosat.serializers import ContextVariableDefault, WritableNestedListSerializer

from orbis.models import OrbisUserProfile, OrbisUserFeedbackRecord


class OrbisUserFeedbackRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrbisUserFeedbackRecord
        fields = [
            "id",
            "timestamp",
            "provided_feedback",
            "source_ids",
            "profile",
        ]
        list_serializer_class = WritableNestedListSerializer

    id = serializers.IntegerField(read_only=True)

    profile = serializers.PrimaryKeyRelatedField(
        default=ContextVariableDefault("profile", raise_error=True),
        queryset=OrbisUserProfile.objects.all(),
        write_only=True,
    )

    def to_internal_value(self, data):
        # put the read-only "id" field back, since it's used to
        # identify unique models in WriteableNestedListSerializer
        id_field_name = "id"
        internal_value = super().to_internal_value(data)
        if id_field_name not in internal_value and id_field_name in data:
            id_field_serializer = self.fields[id_field_name]
            internal_value[id_field_name
                          ] = id_field_serializer.to_internal_value(
                              data[id_field_name]
                          )
        return internal_value


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

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        # get the profile so that any ContextVariableDefault fields
        # in nested serializers work (in-case I don't access those
        # nested serializers via a custom view such as OrbisUserFeedbackView)

        self.fields["feedback_records"].context.update({
            "profile": self.instance or self.context["user"].orbis_profile
        })

    def update(self, instance, validated_data):

        feedback_records_serializer = self.fields["feedback_records"]
        feedback_records_data = validated_data.pop(
            feedback_records_serializer.source
        )
        feedback_records_serializer.crud(
            instances=instance.feedback_records.all(),
            validated_data=feedback_records_data,
            delete_missing=False,
        )
        user_profile = super().update(instance, validated_data)
        return user_profile
