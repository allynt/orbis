from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone as django_tz
from django.utils.translation import gettext_lazy as _

from astrosat.utils import validate_schema

from astrosat_users.fields import UserProfileField


def validate_orb_state(value):
    """
    A simple validator that ensures OrbisUserProfile.orb_state is an object of objects
    """
    orb_state_schema = {"type": "object", "patternProperties": { "^.*": { "type": "object"}}}
    return validate_schema(value, orb_state_schema)


class OrbisUserProfile(models.Model):
    """
    A custom user profile for Orbis Users.
    I still use the standard Astrosat User model
    But this class adds project-specific fields.
    """
    class Meta:
        app_label = "orbis"
        verbose_name = "Orbis User Profile"
        verbose_name_plural = "Orbis User Profiles"

    class UnitChoices(models.TextChoices):
        IMPERIAL = "IMPERIAL", _("Imperial")
        METRIC = "METRIC", _("Metric")

    class RegionChoices(models.TextChoices):
        EUROPE = "EUROPE", _("Europe")
        AFRICA = "AFRICA", _("Africa")
        CENTRAL_ASIA = "CENTRAL_ASIA", _("Central Asia")
        EAST_ASIA = "EAST_ASIA", _("East Asia")
        WEST_ASIA = "WEST_ASIA", _("Western Asia")
        SOUTH_ASIA = "SOUTH_ASIA", _("Southern Asia")
        SOUTH_EAST_ASIA = "SOUTH_EAST_ASIA", _("South East Asia")
        OCEANIA = "OCEANIA", _("Oceania")
        NORTH_AMERICA = "NORTH_AMERICA", _("North America")
        CENTRAL_AMERICA_CARIBBEAN = "CENTRAL_AMERICA_CARIBBEAN", _("Central America & Caribbean")
        SOUTH_AMERICA = "SOUTH_AMERICA", _("South America")
        ARCTIC = "ARCTIC", _("Arctic")
        ANTARCTICA = "ANTARCTICA", _("Antartica")
        OCEANS_SEAS = "OCEANS_SEAS", _("Oceans & seas")

    user = UserProfileField(
        related_name="orbis_profile",
        serializer_class="orbis.serializers.OrbisUserProfileSerializer",
    )

    orb_state = models.JSONField(
        blank=True,
        default=dict,
        validators=[validate_orb_state],
    )

    onboarded = models.BooleanField(
        default=False, help_text=_("Has this user been onboarded"),
    )

    units = models.CharField(
        max_length=256,
        choices=UnitChoices.choices,
        default=UnitChoices.IMPERIAL,
        blank=False,
        null=False,
        help_text=_("The default units for this user"),
    )

    region = models.CharField(
        max_length=256,
        choices=RegionChoices.choices,
        blank=True,
        null=True,
        help_text=_("The default region for this user"),
    )

    max_searches = models.PositiveIntegerField(
        blank=False,
        default=10,
        help_text=_(
            "The maximum number of saved searches allowed for this user."
        ),
    )

    max_results = models.PositiveIntegerField(
        blank=False,
        default=10,
        help_text=_(
            "The maximum number of saved search results allowed for this user."
        ),
    )

    def __str__(self):
        return str(self.user)


class OrbisUserFeedbackRecord(models.Model):
    """
    Tracks the date a user was prompted for feedback for a particular DataSource
    """
    class Meta:
        app_label = "orbis"
        ordering = ["-timestamp"]

    profile = models.ForeignKey(
        OrbisUserProfile,
        on_delete=models.CASCADE,
        related_name="feedback_records"
    )

    timestamp = models.DateTimeField(
        default=django_tz.now, blank=False, null=True
    )
    source_ids = ArrayField(
        models.CharField(max_length=512),
        blank=False,
        null=False,
        help_text=_(
            "An array of source_ids that prompted feedback in this instance."
        )
    )
    provided_feedback = models.BooleanField(
        default=False, help_text=_("Did the user provide feedback?")
    )
