from django.contrib import admin

from maps.models import Satellite, SatelliteScene, SatelliteVisualisation


@admin.register(SatelliteVisualisation)
class SatelliteVisualisationAdmin(admin.ModelAdmin):
    search_fields = ("title",)


@admin.register(SatelliteScene)
class SatelliteSceneAdmin(admin.ModelAdmin):
    search_fields = ("scene_id",)
    list_display = ("scene_id", "satellite",)
    list_filter = ("satellite",)


class SatelliteSceneAdminInline(admin.StackedInline):
    model = SatelliteScene
    fields = ("scene_id",)
    readonly_fields = ("scene_id",)
    show_change_link = True
    extra = 0


@admin.register(Satellite)
class SatelliteAdmin(admin.ModelAdmin):
    search_fields = ("title",)
    inlines = [SatelliteSceneAdminInline]
