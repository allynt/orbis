# core models are defined here
from django.db import models

class GeometryType(models.Model):
    """
    Represents a single geometry type e.g. oa, lsoa, msoa, lad and the order
    of specificity they have e.g. oa is more detailed than lsoa and lsoa is
    more detailed than msoa.
    """
    class Meta:
        app_label = "core"
        verbose_name = "Geometry Type"
        verbose_name_plural = "Geometry Types"
        ordering = ["order"]

    name = models.CharField(max_length=50, unique=True, blank=False, null=False, help_text="Name of geometry type e.g. oa, lsoa, msoa, lad")
    order = models.PositiveSmallIntegerField(default=0, help_text="Order of the geometry's specificity")
