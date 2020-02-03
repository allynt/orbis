from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext as _

from astrosat.utils import validate_schema

def visualisation_thumbnail_path(instance, filename):
    filename = slugify(instance.title)
    return f"satellites/visualisations/{filename}.png"


def validate_properties(value):
    """
    A simple validator that ensures SatelliteScene.properties is an
    object rather than a list or primative
    """
    properties_schema = {"type": "object"}
    return validate_schema(value, properties_schema)

def validate_urls(value):
    """
    A simple validator that ensures SatelliteScene.urls is a
    list of strings
    """
    urls_schema = {
        "type": "array",
        "items": {
            "type": "string"
        }
    }
    return validate_schema(value, urls_schema)

class Satellite(models.Model):

    satellite_id = models.SlugField(
        unique=True,
        blank=False,
        null=False,
        help_text=_("A unique id for the satellite.")
    )

    title = models.CharField(
        max_length=128,
        blank=False,
        null=False,
        help_text=_("A pretty display name for the satellite."),
    )

    description = models.TextField(
        blank=True,
        null=True,
        help_text=_("A description of the satellite."),
    )

    def __str__(self):
        return self.satellite_id


class SatelliteScene(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["scene_id", "satellite"],
                name="unique_satellite_scene",
            )
        ]

    satellite = models.ForeignKey(Satellite, related_name="scenes", on_delete=models.CASCADE)

    scene_id = models.SlugField(
        blank=False,
        null=False,
        help_text=_("A unique id for the scene.")
    )

    properties = JSONField(
        blank=True,
        null=True,
        validators=[validate_properties],
        help_text=_("Some more information to associate with the scene.")
    )

    # TODO: NOT ENTIRELY SURE WHAT THIS FIELD REPRESENTS
    urls = JSONField(
        blank=True,
        null=True,
        validators=[validate_urls],
    )

    thumbnail = models.URLField(
        blank=True,
        null=True,
        help_text=_("The location of this scene's thumbnail; This is an external URL so it is not managed by the app.")
    )

    def __str__(self):
        return self.scene_id


class SatelliteVisualisation(models.Model):

    visualisation_id = models.SlugField(
        blank=False,
        null=False,
        help_text=_("A unique id for the visualisation.")
    )

    title = models.CharField(
        max_length=128,
        blank=False,
        null=False,
        help_text=_("A pretty display name for the visualisation."),
    )

    description = models.TextField(
        blank=True,
        null=True,
        help_text=_("A description of the visualisation."),
    )

    thumbnail = models.FileField(
        upload_to=visualisation_thumbnail_path,
        blank=True,
        null=True,
        help_text=_("A thumbnail image representing this bookmark."),
    )

    def __str__(self):
        return self.visualisation_id
