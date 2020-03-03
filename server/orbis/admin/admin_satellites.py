from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin

from astrosat.admin import get_clickable_m2m_list_display

from orbis.models import (
    Satellite,
    SatelliteResolution,
    SatelliteVisualisation,
    SatelliteSearch,
    SatelliteResult,
)


@admin.register(Satellite)
class SatelliteAdmin(admin.ModelAdmin):
    search_fields = ("title",)
    list_display = ("satellite_id", "order")
    list_editable = ("order",)


@admin.register(SatelliteResolution)
class SatelliteResolutionAdmin(admin.ModelAdmin):
    search_fields = ("title",)
    list_display = ("name", "get_satellites_for_list_display", "order")
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
        "get_resolutions_for_list_display",
    )
    list_filter = ("owner", "created", "start_date", "end_date", "satellites", "resolutions")
    readonly_fields = ("created",)

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # to avoid the "n+1" problem
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("satellites", "resolutions")

    def get_satellites_for_list_display(self, obj):
        return get_clickable_m2m_list_display(Satellite, obj.satellites.all())

    get_satellites_for_list_display.short_description = "satellites"

    def get_resolutions_for_list_display(self, obj):
        return get_clickable_m2m_list_display(Satellite, obj.resolutions.all())

    get_resolutions_for_list_display.short_description = "resolutions"

@admin.register(SatelliteResult)
class SatelliteResultAdmin(GeoModelAdmin):
    search_fields = ("scene_id",)
    list_display = (
        "scene_id",
        "owner",
        "satellite",
        "cloud_cover"
    )
    list_filter = ("satellite", "owner", "cloud_cover")
    readonly_fields = ("url",)
