from rest_framework import serializers

from drf_yasg2.utils import swagger_serializer_method

from astrosat.serializers import ContextVariableDefault

from astrosat_users.models import User
from astrosat_users.serializers import (
    UserSerializer as AstrosatUsersUserSerializer,
)

from orbis.models import (
    Orb,
    OrbisUserProfile,
    OrbisUserFeedbackRecord,
)
from orbis.serializers import OrbSerializer

from maps.models import CustomerMapStyle
from maps.serializers import CustomerMapStyleSerializer


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
            "orb_state",
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


class OrbisUserSerializer(AstrosatUsersUserSerializer):
    """
    Adds "orbs" to the existing UserSerializer
    """
    class Meta:
        model = User
        fields = AstrosatUsersUserSerializer.Meta.fields + [
            "orbs", "map_styles"
        ]

    orbs = serializers.SerializerMethodField()

    map_styles = serializers.SerializerMethodField()

    @swagger_serializer_method(serializer_or_field=OrbSerializer(many=True))
    def get_orbs(self, obj):
        # return all orbs that this user has a licence to...
        orbs = Orb.objects.filter(
            is_active=True,
            licences__customer_user__in=obj.customer_users.values_list(
                "pk", flat=True
            )
        ).distinct()
        return OrbSerializer(orbs, many=True).data

    @swagger_serializer_method(
        serializer_or_field=CustomerMapStyleSerializer(many=True)
    )
    def get_map_styles(self, obj):
        # return all map styles that this user has access to...
        map_styles = CustomerMapStyle.objects.filter(
            customer__in=obj.customer_users.values_list("customer", flat=True)
        ).distinct()

        return CustomerMapStyleSerializer(
            map_styles, many=True, context=self.context
        ).data
