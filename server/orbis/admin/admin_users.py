from django.contrib import admin

from astrosat.admin import CannotAddModelAdminBase, ReadOnlyModelAdminBase

from astrosat_users.admin import UserAdmin as AstrosatUserAdmin
from astrosat_users.models import User as AstrosatUser

from orbis.models import OrbisUserProfile


@admin.register(OrbisUserProfile)
class OrbisUserProfileAdmin(CannotAddModelAdminBase, admin.ModelAdmin):
    pass


class TermsDocumentAgreementInline(ReadOnlyModelAdminBase, admin.TabularInline):
    model = AstrosatUser.terms.through

    fields = ("terms", "timestamp")
    extra = 0
    verbose_name_plural = "Agreed terms"


class UserAdmin(AstrosatUserAdmin):
    """
    Just like the standard UserAdmin, but adds an entry for each time
    the user has agreed terms
    """
    inlines = (TermsDocumentAgreementInline, )


try:
    admin.site.unregister(AstrosatUser)
except admin.sites.NotRegistered:
    pass
admin.site.register(AstrosatUser, UserAdmin)
