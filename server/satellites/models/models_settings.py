from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from astrosat.mixins import SingletonMixin

# the maximum area that can be used as a query parameter
# this is very close to the size of the earth
MAX_AOI_AREA = 500000000


class SatelliteSettings(SingletonMixin, models.Model):
    class Meta:
        app_label = "satellites"
        verbose_name = "Satellite Settings"
        verbose_name_plural = "Satellite Settings"

    maximum_aoi_area = models.FloatField(
        default=500,
        validators=[MaxValueValidator(MAX_AOI_AREA), MinValueValidator(1)],
        help_text=_(
            "The maximum area (in kilometres) that can be used as a query argument."
        )
    )

    def __str__(self):
        return "Satellite Settings"
