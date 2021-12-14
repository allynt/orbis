from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from django.utils.text import slugify
from django.utils.translation import gettext as _

from astrosat.utils import validate_schema, validate_reserved_words

from satellites.adapters import SATELLITE_ADAPTER_REGISTRY
from satellites.utils import project_geometry

##############
# validators #
##############


def validate_properties(value):
    """
    A simple validator that ensures SatelliteScene.properties is an
    object rather than a list or primative
    """
    properties_schema = {"type": "object"}
    return validate_schema(value, properties_schema)


def validate_satellite_id(value):
    """
    A simple validator that prevents some reserved words from
    messing up the url parsing.
    """
    invalid_satellite_ids = [
        "searches", "results", "visualisations", "run_query"
    ]
    return validate_reserved_words(
        value, invalid_satellite_ids, case_insensitive=True
    )


###########
# helpers #
###########


def visualisation_thumbnail_path(instance, filename):
    filename = slugify(instance.title)
    return f"satellites/visualisations/{filename}.png"


########################
# managers & querysets #
########################

# These managers let me deserialize using natural keys
# (this allows me to use fixtures w/out specifying pks).


class SatelliteManager(models.Manager):
    def get_by_natural_key(self, satellite_id):
        return self.get(satellite_id=satellite_id)


class SatelliteVisualisationManager(models.Manager):
    def get_by_natural_key(self, visualisation_id):
        return self.get(visualisation_id=visualisation_id)


class SatelliteVisualisationQuerySet(models.QuerySet):
    def delete(self):
        """
        Ensures that Deleting visualisations via a QuerySet
        calls the custom delete method defined below.
        """
        [obj.delete() for obj in self]


##########
# models #
##########


class Satellite(models.Model):
    """
    A fixed set of satellites that we can search.
    """
    class Meta:
        app_label = "satellites"
        verbose_name = "Satellite"
        verbose_name_plural = "Satellites"
        ordering = ["order"]

    objects = SatelliteManager()

    satellite_id = models.SlugField(
        unique=True,
        blank=False,
        null=False,
        validators=[validate_satellite_id],
        help_text=_("A unique id for the satellite."),
    )

    adapter_name = models.CharField(
        max_length=64,
        blank=False,
        null=False,
        help_text=_(
            "The name of the adapter that contains the specific query fns used by this Satellite"
        )
    )

    title = models.CharField(
        max_length=128,
        blank=False,
        null=False,
        help_text=_("A pretty display name for the satellite."),
    )

    description = models.TextField(
        blank=True, null=True, help_text=_("A description of the satellite.")
    )

    visualisations = models.ManyToManyField(
        "SatelliteVisualisation", related_name="satellites", blank=True
    )

    order = models.IntegerField(
        blank=False,
        null=False,
        default=1,
        help_text=("The order to render the satellite."),
    )

    def __str__(self):
        return self.satellite_id

    def natural_key(self):
        # see above comment in SatelliteManager
        return (self.satellite_id, )

    @property
    def adapter(self):
        return SATELLITE_ADAPTER_REGISTRY[self.adapter_name]


class SatelliteVisualisation(models.Model):
    """
    The visualisations that are available for a given satellite.
    """
    class Meta:
        app_label = "satellites"
        verbose_name_plural = "Satellite Visualisation"
        verbose_name_plural = "Satellite Visualisations"
        ordering = ["order"]

    objects = SatelliteVisualisationManager.from_queryset(
        SatelliteVisualisationQuerySet
    )()

    visualisation_id = models.SlugField(
        unique=True,
        blank=False,
        null=False,
        help_text=_("A unique id for the visualisation."),
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
        help_text=_("A description of the visualisation.")
    )

    order = models.IntegerField(
        blank=False,
        null=False,
        default=1,
        help_text=("The order to render the visualisation."),
    )

    thumbnail = models.FileField(
        upload_to=visualisation_thumbnail_path,
        blank=True,
        null=True,
        help_text=_("A thumbnail image representing this visualisation."),
    )

    def __str__(self):
        return self.visualisation_id

    def natural_key(self):
        return (self.visualisation_id, )

    def delete(self, *args, **kwargs):
        """
        When a visualisation is deleted, delete the corresponding thumbnailfrom storage.
        Doing it in a method instead of via signals to handle the case where objects are deleted in bulk.
        """
        if self.thumbnail:
            thumbnail_name = self.thumbnail.name
            thumbnail_storage = self.thumbnail.storage
            if thumbnail_storage.exists(thumbnail_name):
                thumbnail_storage.delete(thumbnail_name)

        return super().delete(*args, **kwargs)


class SatelliteSearch(gis_models.Model):
    """
    A search query.
    """
    class Meta:
        app_label = "satellites"
        verbose_name = "Satellite Search"
        verbose_name_plural = "Satellite Searches"
        ordering = ["-created"]

    PRECISION = 6

    created = models.DateTimeField(auto_now_add=True)

    satellites = models.ManyToManyField(
        "Satellite",
        blank=False,
    )

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    aoi = gis_models.PolygonField(blank=False)

    def clean(self):

        if self.start_date > self.end_date:
            raise ValidationError(
                "end_date must be greater than or equal to start_date"
            )

        projected_aoi = project_geometry(self.aoi)
        if (projected_aoi.area * .000001) > settings.MAXIMUM_AOI_AREA:
            raise ValidationError(
                f"The area of the aoi must be less than or equal to {settings.MAXIMUM_AOI_AREA}."
            )


class SatelliteResult(gis_models.Model):
    """
    A seach query result.
    There are three types of information associated w/ a result:
    1) top-level information: this is information that all satellites must have
       they are stored as primary fields in this model and are accessed by the
       client on the results panel
    2) metadata: this is the information that can be extracted from properties;
       it is stored as nicely-formatted JSON in this model, w/ "pretty" keys
       it is created by the adapter and can vary w/ each satellite
       it is passed on to the client for use in the "more info" dialog box
    3) raw_data: this is the "raw" information returned by the specific satellite adapter
       it is not necessarily passed on to the client
    """
    class Meta:
        app_label = "satellites"
        verbose_name = "Satellite Result"
        verbose_name_plural = "Satellite Results"
        constraints = [
            models.UniqueConstraint(
                fields=["scene_id", "satellite"], name="unique_satellite_scene"
            )
        ]

    PRECISION = 6

    scene_id = models.SlugField(
        max_length=256,
        blank=False,
        null=False,
        help_text=_("A unique id for the scene.")
    )

    satellite = models.ForeignKey(
        Satellite, related_name="scenes", on_delete=models.CASCADE
    )

    cloud_cover = models.FloatField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
    )

    created = models.DateTimeField(blank=True, null=True)

    footprint = gis_models.GeometryField(blank=False)

    metadata = models.JSONField(
        blank=True,
        null=True,
        validators=[validate_properties],
        help_text=_("Some more information to associate with the scene."),
    )

    raw_data = models.JSONField(
        blank=True,
        null=True,
        validators=[validate_properties],
        help_text=_("The original 'raw' data returned by the search."),
    )

    @property
    def thumbnail_url(self):
        """
        The URL to retrieve a thumbnail image from the OLSP (On-Line Scene Processor);
        templated bits are filled in by the client
        """
        url_template = "{0}/{1}/{2}/{{VISUALISATION_ID}}/preview"
        return url_template.format(
            settings.OLSP_URL, self.satellite.satellite_id, self.scene_id
        )

    @property
    def tile_url(self):
        """
        The URL to retrieve a tile from the OLSP (On-Line Scene Processor);
        templated bits are filled in by the client
        """
        url_template = ("{0}/{1}/{2}/{{VISUALISATION_ID}}/tilejson")
        return url_template.format(
            settings.OLSP_URL, self.satellite.satellite_id, self.scene_id
        )
