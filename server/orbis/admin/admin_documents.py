from django.contrib import admin

from orbis.models import Document, TermsDocument, PrivacyDocument, UserGuideDocument


class HasAgreementsFilter(admin.SimpleListFilter):
    # have to define an explicit ListFilter b/c
    # has_agreements is a property, not a field
    parameter_name = "get_has_agreements_for_list_display"
    title = "has_agreements"

    def lookups(self, request, model_admin):
        return (
            ("Yes", "Yes"),
            ("No", "No"),
        )

    def queryset(self, request, qs):
        value = self.value()
        if value == "Yes":
            qs = qs.filter(users__isnull=False)
        elif value == "No":
            qs = qs.filter(users__isnull=True)
        return qs


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    fields = (
        "name",
        "version",
        "slug",
        "type",
        "orb",
        "is_active",
        "created",
        "modified",
        "file",
        "n_agreements",
    )
    list_display = (
        "name",
        "version",
        "type",
        "orb",
        "is_active",
        "get_has_agreements_for_list_display",
    )
    list_filter = (
        "is_active",
        "type",
        "orb",
        HasAgreementsFilter,
    )
    readonly_fields = (
        "slug",
        "created",
        "modified",
        "n_agreements",
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("users")

    def get_has_agreements_for_list_display(self, obj):
        return obj.has_agreements

    get_has_agreements_for_list_display.boolean = True
    get_has_agreements_for_list_display.short_description = "has agreements"


@admin.register(PrivacyDocument)
class PrivacyDocumentAdmin(admin.ModelAdmin):
    fields = ("name", "version", "file", "is_active", "created", "modified")
    list_display = ("name", "version", "is_active")
    list_filter = ("is_active", )
    readonly_fields = ("created", "modified")


@admin.register(UserGuideDocument)
class UserGuideDocumentAdmin(admin.ModelAdmin):
    fields = ("name", "version", "file", "is_active", "created", "modified")
    list_display = ("name", "version", "is_active")
    list_filter = ("is_active", )
    readonly_fields = ("created", "modified")


@admin.register(TermsDocument)
class TermsDocumentAdmin(admin.ModelAdmin):
    class HasAgreementsFilter(admin.SimpleListFilter):
        # have to define an explicit ListFilter b/c
        # has_agreements is a property, not a field
        parameter_name = "get_has_agreements_for_list_display"
        title = "has_agreements"

        def lookups(self, request, model_admin):
            return (
                ("Yes", "Yes"),
                ("No", "No"),
            )

        def queryset(self, request, qs):
            value = self.value()
            if value == "Yes":
                qs = qs.filter(users__isnull=False)
            elif value == "No":
                qs = qs.filter(users__isnull=True)
            return qs

    # add some extra fields...
    fields = (
        "name",
        "version",
        "file",
        "is_active",
        "created",
        "modified",
        "n_agreements"
    )
    list_display = (
        "name", "version", "is_active", "get_has_agreements_for_list_display"
    )
    list_filter = (
        "is_active",
        HasAgreementsFilter,
    )
    readonly_fields = ("created", "modified", "n_agreements")

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("users")

    def get_has_agreements_for_list_display(self, obj):
        return obj.has_agreements

    get_has_agreements_for_list_display.boolean = True
    get_has_agreements_for_list_display.short_description = "has agreements"
