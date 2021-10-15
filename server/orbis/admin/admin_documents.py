from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
from django.forms import ModelForm

from orbis.models import Document


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


class DocumentAdminForm(ModelForm):
    class Meta:
        model = Document
        fields = "__all__"

    def clean(self):
        """
        Check a Document's UniqueConstraints during cleaning.
        """
        cleaned_data = super().clean()

        other_documents = Document.objects.exclude(pk=self.instance.pk)

        # Check `unique_type_name_version_orb` and `unique_type_name_version`
        # constraints.
        if other_documents.filter(
            type=cleaned_data["type"],
            name=cleaned_data["name"],
            version=cleaned_data["version"],
            orb=cleaned_data["orb"],
        ).exists():
            raise ValidationError(
                "`type`, `name` and `orb` must be unique"
            )

        # Check `unique_type_name_orb_active and `unique_type_name_active`
        # constraints.
        if other_documents.filter(
            type=cleaned_data["type"],
            name=cleaned_data["name"],
            orb=cleaned_data["orb"],
            is_active=True,
        ) and cleaned_data["is_active"]:
            raise ValidationError(
                "There cannot be multiple active documents with the same `type`, `name` and `orb`"
            )

        return cleaned_data


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    form = DocumentAdminForm

    fields = (
        "name",
        "version",
        "slug",
        "title",
        "description",
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
