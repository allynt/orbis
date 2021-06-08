from django.contrib import admin

from .models import GeometryType

# Register your models here.
@admin.register(GeometryType)
class GeometryTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
