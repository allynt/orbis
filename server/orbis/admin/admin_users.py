from django.contrib import admin

from astrosat.admin import CannotAddModelAdminBase

from orbis.models import OrbisUserProfile


@admin.register(OrbisUserProfile)
class OrbisUserProfileAdmin(CannotAddModelAdminBase, admin.ModelAdmin):
    pass
