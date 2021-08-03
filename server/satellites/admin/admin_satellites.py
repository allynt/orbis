import json

from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin
from django.db.models import JSONField
from django.forms import Select, ModelForm
from django.utils.html import mark_safe

from astrosat.admin import get_clickable_m2m_list_display, JSONAdminWidget

from satellites.adapters import SATELLITE_ADAPTER_REGISTRY
from satellites.models import (
    Satellite,
    SatelliteVisualisation,
    SatelliteDataSource,
)


class SatelliteAdminForm(ModelForm):
    """
    A custom Admin Form that restricts the adapter name to only those defined in SATELLITE_ADAPTER_REGISTRY
    """
    class Meta:
        model = Satellite
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["adapter_name"].widget = Select(
            choices=((adapter_name, adapter_name)
                     for adapter_name in sorted(SATELLITE_ADAPTER_REGISTRY))
        )


@admin.register(Satellite)
class SatelliteAdmin(admin.ModelAdmin):
    form = SatelliteAdminForm
    list_display = (
        "satellite_id",
        "order",
    )
    list_editable = ("order", )
    search_fields = (
        "title",
        "satellite_id",
    )


@admin.register(SatelliteVisualisation)
class SatelliteVisualisationAdmin(admin.ModelAdmin):
    list_display = (
        "visualisation_id", "get_satellites_for_list_display", "order"
    )
    list_editable = ("order", )
    list_filter = ("satellites", )
    search_fields = (
        "visualisation_id",
        "title",
    )

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # to avoid the "n+1" problem
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("satellites")

    def get_satellites_for_list_display(self, obj):
        return get_clickable_m2m_list_display(Satellite, obj.satellites.all())

    get_satellites_for_list_display.short_description = "satellites"


@admin.register(SatelliteDataSource)
class SatelliteDataSourceAdmin(admin.ModelAdmin):
    list_display = ("name", "customer_user", "source_id")
    list_filter = ("customer_user", )
    readonly_fields = (
        "created",
        "get_metadata_for_detail_display",
        "source_id",
    )
    search_fields = ("name", "description")

    def get_metadata_for_detail_display(self, obj):
        # (makes metadata look pretty in an HTML template)
        metadata = json.dumps(obj.metadata, indent=4)
        for k, v in [("\n", "<br/>"), (" ", "&nbsp;")]:
            metadata = metadata.replace(k, v)
        return mark_safe(metadata)

    get_metadata_for_detail_display.short_description = "metadata"
