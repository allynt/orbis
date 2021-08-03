from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from astrosat.mixins import SingletonMixin

# the maximum number of minutes a data_token is valid for
# this is enforced by the edge lambda protecting the data server
MAX_DATA_TOKEN_TIMEOUT = 60


class OrbisSettings(SingletonMixin, models.Model):
    class Meta:
        app_label = "orbis"
        verbose_name = "Orbis Settings"
        verbose_name_plural = "Orbis Settings"

    data_token_timeout = models.IntegerField(
        default=60,
        validators=[
            MaxValueValidator(MAX_DATA_TOKEN_TIMEOUT), MinValueValidator(1)
        ],
        help_text=_("The time (in minutes) that the data_token is valid for.")
    )

    def __str__(self):
        return "Orbis Settings"
