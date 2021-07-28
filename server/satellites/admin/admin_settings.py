from django.contrib import admin
from satellites.models import SatelliteSettings


@admin.register(SatelliteSettings)
class SatelliteSettingsAdmin(admin.ModelAdmin):
    pass
