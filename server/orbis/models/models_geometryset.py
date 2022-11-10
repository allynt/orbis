# core models are defined here
from django.db import models


class GeometrySet(models.Model):
    """
    Represents a single dataset geometry type ordering e.g. oa, lsoa, msoa, lad and the order of specificity they have e.g. oa is more detailed than lsoa and lsoa is more detailed than msoa.
    """
    class Meta:
        app_label = "orbis"
        verbose_name = "GeometrySet Type"
        verbose_name_plural = "GeometrySet Types"
        ordering = ["order"]

    name = models.SlugField(
        max_length=50,
        unique=True,
        blank=False,
        null=False,
        help_text="Name of dataset type e.g. oa, lsoa, msoa, lad",
    )
    order = models.PositiveSmallIntegerField(
        default=1,
        help_text="Order of the dataset type's specificity",
    )

    description = models.TextField(
        blank=True,
        null=True,
        help_text="A description of what the GeometrySet name means.",
    )
