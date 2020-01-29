from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin

from maps.models import Bookmark


@admin.register(Bookmark)
class BookmarkAdmin(GeoModelAdmin):
    search_fields = ("title",)
    list_display = ("title", "owner",)
    list_filter = ("owner", "created", "modified",)
    readonly_fields = ("created", "modified",)
