from django.conf import settings
from django.db import models
from django.utils.translation import gettext as _

from orbis.models import StoredDataSource


class SatelliteDataSource(StoredDataSource):
    class Meta:
        app_label = "satellites"
        verbose_name = "Satellite DataSource"
        verbose_name_plural = "Satellite DataSources"

    DEFAULT_STORAGE_SIZE = 0.1

    satellite_id = models.SlugField(
        blank=False,
        null=False,
        max_length=128,
    )
    scene_id = models.SlugField(
        blank=False,
        null=False,
        max_length=512,
    )
    visualisation_id = models.SlugField(
        blank=False,
        null=False,
        max_length=128,
    )

    @property
    def url(self):
        return f"{settings.OLSP_URL}/{self.satellite_id}/{self.scene_id}/{self.visualisation_id}/tile/{{z}}/{{x}}/{{y}}"

    @property
    def metadata(self):
        metadata = {
            "label": self.name,
            "description": self.description,
            "url": self.url,
            "type": self.type,
            "application": {
                "orbis": {
                    "layer": {
                        "name": "TileLayer",
                        "props": {
                            "config": "satelliteImageConfig"
                        }
                    },
                    "map_component": {},
                    "sidebar_component": [
                        {
                            "name": "LayerVisibilityButton",
                            "props": {}
                        }
                    ],
                    "categories": self.categories,
                    "orbs": self.orbs,
                }
            }
        }  # yapf: disable
        return metadata
