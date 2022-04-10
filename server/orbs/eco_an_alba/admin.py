from django.contrib import admin
from django.contrib.gis import admin as gis_admin
from django.db.models import JSONField

from astrosat.admin import JSONAdminWidget

from orbs.eco_an_alba.models import Proposal

@admin.register(Proposal)
class ProposalAdmin(gis_admin.ModelAdmin):
    formfield_overrides = {
        JSONField: {
            "widget": JSONAdminWidget
        },
    }
