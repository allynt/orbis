from django.contrib import admin

from maps.models import MapStyle


@admin.register(MapStyle)
class MapStyleAdmin(admin.ModelAdmin):
    fields = (
        "name",
        "style",
        "thumbnail",
    )
    list_display = ("name", )
    search_fields = ("name", )
