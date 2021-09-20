from django import forms
from django.contrib import admin

from astrosat.admin import CannotAddModelAdminBase, ReadOnlyModelAdminBase

from astrosat_users.admin import UserAdmin as AstrosatUserAdmin
from astrosat_users.models import User as AstrosatUser

from orbis.models import OrbisUserProfile, OrbisUserFeedbackRecord, DataStorage


class OrbisUserFeedbackRecordInline(admin.TabularInline):
    model = OrbisUserFeedbackRecord

    extra = 0
    fields = ("timestamp", "provided_feedback", "source_ids")
    verbose_name_plural = "Feedback records"


@admin.register(OrbisUserProfile)
class OrbisUserProfileAdmin(CannotAddModelAdminBase, admin.ModelAdmin):
    inlines = (OrbisUserFeedbackRecordInline, )


class DocumentAgreementInlineForm(forms.ModelForm):
    """
    A custom form used by DocumentAgreementInline just to display the "document.type" field
    """
    class Meta:
        model = AstrosatUser.documents.through

        fields = ("document", )
        readonly_fields = (
            "type",
            "timestamp",
        )

    type = forms.CharField(disabled=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        document_agreement = self.instance
        self.initial = {
            "type":
                document_agreement.document.type
                if document_agreement.pk else "NONE"
        }


class DocumentAgreementInline(ReadOnlyModelAdminBase, admin.TabularInline):
    model = AstrosatUser.documents.through

    extra = 0
    fields = (
        "document",
        "type",
        "timestamp",
    )
    form = DocumentAgreementInlineForm
    verbose_name_plural = "Agreed documents"


class DataStorageAdminInline(admin.TabularInline):
    model = DataStorage

    extra = 0
    fields = ("title", )
    readonly_fields = ("created", "size")
    verbose_name_plural = "Data Storage"


class UserAdmin(AstrosatUserAdmin):
    """
    Just like the standard UserAdmin, but adds an entry for each time
    the user has agreed terms
    """
    inlines = (
        DocumentAgreementInline,
        DataStorageAdminInline,
    )


try:
    admin.site.unregister(AstrosatUser)
except admin.sites.NotRegistered:
    pass
admin.site.register(AstrosatUser, UserAdmin)
