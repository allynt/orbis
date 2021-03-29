from django.contrib import admin

from orbis.models import TermsDocument, PrivacyDocument


class DocumentAdmin(admin.ModelAdmin):
    list_display = ("version", "is_active")
    list_filter = ("is_active", )
    readonly_fields = ("created", "modified")


@admin.register(TermsDocument)
class TermsDocumentAdmin(DocumentAdmin):
    pass


@admin.register(PrivacyDocument)
class PrivacyDocumentAdmin(DocumentAdmin):
    pass
