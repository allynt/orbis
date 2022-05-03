from django.core.validators import FileExtensionValidator
from django.db import models

from astrosat_users.models import Customer


def map_styles_path(instance, filename):
    return f"map_styles/{filename}"


class MapStyle(models.Model):
    """
    A model for storing map styles.
    """
    class Meta:
        verbose_name = "Map Style"
        verbose_name_plural = "Map Styles"

    name = models.CharField(
        blank=False,
        null=False,
        max_length=255,
        help_text="Name of the map style."
    )
    style = models.FileField(
        blank=False,
        null=False,
        upload_to=map_styles_path,
        validators=[FileExtensionValidator(["json"])],
        help_text="The style file to use for the map.",
    )
    thumbnail = models.FileField(
        blank=False,
        null=False,
        upload_to=map_styles_path,
        help_text="Thumbnail of the map style.",
    )

    customers = models.ManyToManyField(
        Customer,
        through="CustomerMapStyle",
        related_name="map_styles",
        help_text="The customer that uses this map style.",
    )

    def __str__(self):
        return self.name


class CustomerMapStyle(models.Model):
    """
    A model for storing the relationship between customers and map styles.
    """
    class Meta:
        verbose_name = "Customer Map Style"
        verbose_name_plural = "Customer Map Styles"

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="customer",
        help_text="The customer that uses this map style.",
    )
    map_style = models.ForeignKey(
        MapStyle,
        on_delete=models.CASCADE,
        related_name="customer_map_styles",
        help_text="The map style that the customer uses.",
    )
    api_key = models.CharField(
        blank=True,
        null=True,
        max_length=255,
        help_text="The API key for the map style."
    )
