from django.contrib import admin
from orbis.models import OrbisSettings


@admin.register(OrbisSettings)
class OrbisSettingsAdmin(admin.ModelAdmin):
    pass
