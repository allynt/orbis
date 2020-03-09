from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin

from astrosat.admin import get_clickable_m2m_list_display

from orbis.models import (
    Satellite,
    SatelliteVisualisation,
    SatelliteTier,
    SatelliteSearch,
    SatelliteResult,
)


##############
# satellites #
##############


@admin.register(Satellite)
class SatelliteAdmin(admin.ModelAdmin):
    search_fields = ("title",)
    list_display = ("satellite_id", "order")
    list_editable = ("order",)


@admin.register(SatelliteVisualisation)
class SatelliteVisualisationAdmin(admin.ModelAdmin):
    search_fields = ("title",)
    list_display = ("visualisation_id", "get_satellites_for_list_display", "order")
    list_editable = ("order",)
    list_filter = ("satellites",)

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # to avoid the "n+1" problem
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("satellites")

    def get_satellites_for_list_display(self, obj):
        return get_clickable_m2m_list_display(Satellite, obj.satellites.all())

    get_satellites_for_list_display.short_description = "satellites"


######################
# satellite searches #
######################


@admin.register(SatelliteTier)
class SatelliteTierAdmin(admin.ModelAdmin):
    search_fields = ("title",)
    list_display = ("name", "order")
    list_editable = ("order",)


@admin.register(SatelliteSearch)
class SatelliteSearchAdmin(GeoModelAdmin):
    search_fields = ("name",)
    list_display = (
        "name",
        "owner",
        "created",
        "start_date",
        "end_date",
        "get_satellites_for_list_display",
        "get_tiers_for_list_display",
    )
    list_filter = (
        "owner",
        "created",
        "start_date",
        "end_date",
        "satellites",
        "tiers",
    )
    readonly_fields = ("created",)

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # to avoid the "n+1" problem
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("satellites", "tiers")

    def get_satellites_for_list_display(self, obj):
        return get_clickable_m2m_list_display(Satellite, obj.satellites.all())

    get_satellites_for_list_display.short_description = "satellites"

    def get_tiers_for_list_display(self, obj):
        return get_clickable_m2m_list_display(SatelliteTier, obj.tiers.all())

    get_tiers_for_list_display.short_description = "tiers"


#####################
# satellite results #
#####################


@admin.register(SatelliteResult)
class SatelliteResultAdmin(GeoModelAdmin):
    search_fields = ("scene_id",)
    list_display = ("scene_id", "owner", "satellite", "tier", "cloud_cover")
    list_filter = ("satellite", "tier", "owner", "cloud_cover")
    readonly_fields = ("thumbnail_url", "tile_url", "download_url")
