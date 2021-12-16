import json

from django.contrib import admin
from django.utils.safestring import mark_safe

from astrosat.admin import get_clickable_fk_list_display

from orbis.models import DataStorage, StoredDataSource


@admin.register(DataStorage)
class DataStorageAdmin(admin.ModelAdmin):
    fields = (
        "title",
        "size",
        "customer",
        "user",
        "status",
    )
    list_display = (
        "title",
        "customer",
        "user",
        "get_data_source_for_list_display",
        "status",
    )
    list_filter = (
        "customer",
        "user",
        "status",
    )
    readonly_fields = ("created", )
    search_fields = ("title", )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("data_source")

    def get_data_source_for_list_display(self, obj):
        data_source = obj.data_source
        if data_source is not None:
            return get_clickable_fk_list_display(data_source)

    get_data_source_for_list_display.short_description = "Stored Data Source"


class StoredDataSourceAdmin(admin.ModelAdmin):
    """
    Admin for abstract StoredDataSource
    """
    list_display = (
        "name",
        "customer_user",
        "source_id",
        "get_storage_for_list_display",
    )
    list_filter = ("customer_user", )
    readonly_fields = (
        "created",
        "get_metadata_for_detail_display",
        "source_id",
    )
    search_fields = ("name", "description")

    def get_storage_for_list_display(self, obj):
        data_storage = obj.data_storage
        if data_storage is not None:
            return get_clickable_fk_list_display(data_storage)

    get_storage_for_list_display.short_description = "Storage"

    def get_metadata_for_detail_display(self, obj):
        # (makes metadata look pretty in an HTML template)
        metadata = json.dumps(obj.metadata, indent=4)
        for k, v in [("\n", "<br/>"), (" ", "&nbsp;")]:
            metadata = metadata.replace(k, v)
        return mark_safe(metadata)

    get_metadata_for_detail_display.short_description = "metadata"
