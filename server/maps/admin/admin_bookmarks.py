from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin
from django.db.models import JSONField

from maps.models import Bookmark

from astrosat.admin import JSONAdminWidget


@admin.register(Bookmark)
class BookmarkAdmin(GeoModelAdmin):
    formfield_overrides = {JSONField: {"widget": JSONAdminWidget}}
    list_display = ("title", "owner",)
    list_filter = ("owner", "created", "modified",)
    readonly_fields = ("created", "modified",)
    search_fields = ("title",)
