from django.contrib import admin

from astrosat.admin import get_clickable_fk_list_display

from orbis.models import DataStorage


@admin.register(DataStorage)
class DataStorageAdmin(admin.ModelAdmin):
    fields = (
        "title",
        "size",
        "customer",
        "user",
    )
    list_display = (
        "title",
        "customer",
        "user",
        "get_satellite_source_for_list_display",
    )
    list_filter = (
        "customer",
        "user",
    )
    readonly_fields = ("created", )
    search_fields = ("title", )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("satellite_source")

    def get_satellite_source_for_list_display(self, obj):
        satellite_source = obj.satellite_source
        if satellite_source is not None:
            return get_clickable_fk_list_display(satellite_source)

    get_satellite_source_for_list_display.short_description = "Satellite Data Source"
