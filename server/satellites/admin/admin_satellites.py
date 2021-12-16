from django.contrib import admin
from django.forms import Select, ModelForm

from astrosat.admin import get_clickable_fk_list_display, get_clickable_m2m_list_display

from satellites.adapters import SATELLITE_ADAPTER_REGISTRY
from satellites.models import (
    Satellite,
    SatelliteVisualisation,
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
