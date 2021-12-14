from django.contrib import admin

from orbis.admin import StoredDataSourceAdmin

from satellites.models import SatelliteDataSource


@admin.register(SatelliteDataSource)
class SatelliteDataSourceAdmin(StoredDataSourceAdmin):
    pass
