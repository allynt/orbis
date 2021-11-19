from django.conf import settings

from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import GEOSGeometry
from django.utils.text import slugify


def aoi_thumbnail_path(instance, filename):
    filename = slugify(instance.name)
    return f"aois/{instance.owner.username}/{filename}.png"


class AoiQuerySet(models.QuerySet):
    """ Ensure deleting via queryset calls the custome delete method. """
    def delete(self):
        for obj in self:
            obj.delete()


class Aoi(gis_models.Model):
    """ Representation of a single AOI. """
    class Meta:
        verbose_name = "AOI"
        verbose_name_plural = "AOIs"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "owner"],
                name="unique_name_per_user",
            )
        ]

    objects = AoiQuerySet.as_manager()

    name = models.CharField(
        max_length=128,
        blank=False,
        null=False,
        help_text="Name of the AOI instance"
    )
    description = models.TextField(
        blank=True, null=True, help_text="Description of the AOI instance"
    )
    created = models.DateTimeField(
        auto_now_add=True, help_text=("When the AOI was first created.")
    )
    modified = models.DateTimeField(
        auto_now=True, help_text=("When the AOI was last modified.")
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name="aois",
        help_text="Owner of the AOI"
    )

    thumbnail = models.FileField(
        upload_to=aoi_thumbnail_path,
        blank=True,
        null=True,
        help_text="The thumbnail image representing an AOI."
    )

    geometry = gis_models.GeometryField(blank=False)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"AOI: [name={self.name}, description={self.description}, owner={self.owner}, created={self.created}, modified={self.modified}, geometry={self.geometry}, thumbnail={self.thumbnail}]"

    def delete(self, *args, **kwargs):
        """
        When an AOI is deleted, delete the corresponding thumbnail from storage.
        """
        if self.thumbnail:
            thumbnail_name = self.thumbnail.name
            thumbnail_storage = self.thumbnail.storage

            if thumbnail_storage.exists(thumbnail_name):
                thumbnail_storage.delete(thumbnail_name)

        return super().delete(*args, **kwargs)
