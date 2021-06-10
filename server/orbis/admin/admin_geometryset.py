from django.contrib import admin

from orbis.models import GeometrySet


# Register your models here.
@admin.register(GeometrySet)
class GeometrySetAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "order",
    )
    list_editable = ("order", )
