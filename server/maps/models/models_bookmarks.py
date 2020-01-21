from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext as _

from astrosat.utils import validate_schema
from astrosat_users.models import get_sentinel_user

from maps.storage import S3Storage, LocalStorage


FEATURE_COLLECTION_SCHEMA = {
    # defines the schema of the feature_collection JSONField below
    "type": "object",
    "properties": {
        "type": {"type": "string", "pattern": "^FeatureCollection$"},
        "features": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {"type": "string", "pattern": "^Feature$"},
                    "geometry": {"type": "object"},
                    "properties": {"type": "object"},
                },
                "required": ["geometry", "properties"],
            },
        },
    },
    "required": ["features"],
}


def validate_feature_collection(value):
    return validate_schema(value, FEATURE_COLLECTION_SCHEMA)


def bookmark_thumbnail_path(instance, filename):
    filename = slugify(instance.title)
    return f"bookmarks/{instance.owner.username}/{filename}.png"


class BookmarkManager(models.Manager):

    def delete(self):
        """
        Ensures that Deleting bookmarks via a QuerySet calls the custom delete method.
        """
        for obj in self.get_queryset():
            obj.delete()


class Bookmark(gis_models.Model):
    class Meta:

        unique_together = ["owner", "title"]

    objects = BookmarkManager()

    PRECISION = 6

    title = models.CharField(
        max_length=128,
        blank=False,
        null=False,
        help_text=_("A pretty display name for the bookmark."),
    )

    description = models.TextField(
        blank=True,
        null=True,
        help_text=_("A description of the bookmark."),
    )

    feature_collection = JSONField(
        blank=True,
        null=True,
        validators=[validate_feature_collection],
        help_text=_("a GeoJSON description of the data being bookmarked."),
    )

    center = gis_models.PointField(
        blank=False,
        null=False,
        help_text=_("The center point of this bookmark on the map."),
    )

    zoom = models.FloatField(
        blank=False,
        null=False,
        help_text=_("The zoom level of the bookmark on the map."),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.SET(get_sentinel_user),
        related_name="bookmarks",
        help_text=_("The owner of this bookmark."),
    )

    thumbnail = models.FileField(
        storage=S3Storage(),
        # storage=LocalStorage(),
        upload_to=bookmark_thumbnail_path,
        blank=True,
        null=True,
        help_text=_("A thumbnail image representing this bookmark."),
    )

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        """
        When a bookmark is deleted, delete the corresponding thumbnail
        from storage.  Doing it in a method instead of a signal to handle
        the case where objects are deleted in bulk (see BookmarkManager).
        """

        if self.thumbnail:
            thumbnail_name = self.thumbnail.name
            thumbnail_storage = self.thumbnail.storage
            if thumbnail_storage.exists(thumbnail_name):
                thumbnail_storage.delete(thumbnail_name)

        return super().delete(*args, **kwargs)
