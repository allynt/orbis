from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin

from maps.models.models_aois import Aoi


@admin.register(Aoi)
class AoiAdmin(GeoModelAdmin):
    list_display = ("name", "created", "owner")
    list_filter = (
        "name",
        "created",
        "modified",
        "owner",
    )
    readonly_fields = (
        "created",
        "modified",
    )
    search_fields = (
        "name",
        "created",
        "owner",
    )
