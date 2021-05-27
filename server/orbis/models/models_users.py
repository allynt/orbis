from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone as django_tz
from django.utils.translation import gettext_lazy as _

from astrosat_users.fields import UserProfileField


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

    user = UserProfileField(
        related_name="orbis_profile",
        serializer_class="orbis.serializers.OrbisUserProfileSerializer",
    )

    IMPERIAL = "Imperial"
    METRIC = "Metric"

    UnitChoices = [
        (IMPERIAL, IMPERIAL),
        (METRIC, METRIC),
    ]

    EUROPE = "Europe"
    AFRICA = "Africa"
    CENTRAL_ASIA = "Central Asia"
    EAST_ASIA = "East Asia"
    WEST_ASIA = "Western Asia"
    SOUTH_ASIA = "Southern Asia"
    SOUTH_EAST_ASIA = "South East Asia"
    OCEANIA = "Oceania"
    NORTH_AMERICA = "North America"
    CENTRAL_AMERICA_CARIBBEAN = "Central America & Caribbean"
    SOUTH_AMERICA = "South America"
    ARCTIC = "Arctic"
    ANTARCTICA = "Antartica"
    OCEANS_SEAS = "Oceans & seas"

    RegionChoices = [
        (EUROPE, EUROPE),
        (AFRICA, AFRICA),
        (CENTRAL_ASIA, CENTRAL_ASIA),
        (EAST_ASIA, EAST_ASIA),
        (WEST_ASIA, WEST_ASIA),
        (SOUTH_ASIA, SOUTH_ASIA),
        (SOUTH_EAST_ASIA, SOUTH_EAST_ASIA),
        (OCEANIA, OCEANIA),
        (NORTH_AMERICA, NORTH_AMERICA),
        (CENTRAL_AMERICA_CARIBBEAN, CENTRAL_AMERICA_CARIBBEAN),
        (SOUTH_AMERICA, SOUTH_AMERICA),
        (ARCTIC, ARCTIC),
        (ANTARCTICA, ANTARCTICA),
        (OCEANS_SEAS, OCEANS_SEAS),
    ]

    onboarded = models.BooleanField(
        default=False, help_text=_("Has this user been onboarded")
    )
    units = models.CharField(
        max_length=256,
        choices=UnitChoices,
        default=IMPERIAL,
        blank=False,
        null=False,
        help_text=_("The default units for this user"),
    )
    region = models.CharField(
        max_length=256,
        choices=RegionChoices,
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
