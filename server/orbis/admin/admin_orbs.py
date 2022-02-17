from urllib.parse import quote as urlquote

from django import forms
from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db.models import F, Value
from django.db.models.functions import Concat
from django.forms import CheckboxSelectMultiple, IntegerField, ModelForm
from django.urls import reverse
from django.utils.html import format_html

from astrosat.admin import get_clickable_m2m_list_display, JSONAdminWidget
from astrosat_users.models import Customer, User

from orbis.models import (
    Access,
    DataScope,
    Document,
    Licence,
    LicencedCustomer,
    Orb,
    OrbImage,
)

################
# custom forms #
################


class AccessFormField(IntegerField):
    """
    a pretty field that lets users easily set access-levels
    """
    def __init__(self, *args, **kwargs):
        choices = kwargs.pop("choices", ())
        kwargs["widget"] = CheckboxSelectMultiple(choices=choices)
        super().__init__(*args, **kwargs)

    def prepare_value(self, value):
        if isinstance(value, list):
            # value might still be a list if the form wasn't valid
            return value

        # takes an integer and returns a list
        int_value = super().prepare_value(value) or 0
        list_value = [
            2**i for i,
            b in enumerate(map(int, reversed(bin(int_value)[2:]))) if b
        ]
        return list_value

    def clean(self, value):
        # takes a list and retuns an integer
        int_value = sum(map(int, value))
        return super().clean(int_value)


class AccessForm(ModelForm):
    """
    An abstract form that uses the above field
    """

    access = AccessFormField(initial=Access.READ, choices=Access.choices())


class OrbAdminForm(ModelForm):
    """
    A custom Admin Form to make some of the Orb Fields prettier
    """
    class Meta:
        model = Orb
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["short_description"].widget.attrs.update({
            "cols": 80, "class": "vLargeTextField"
        })
        self.fields["default_orb_state"].widget = JSONAdminWidget()


###########
# inlines #
###########


class DataScopeAdminInline(admin.TabularInline):
    # in theory, you can't use an inline w/ m2m
    # so I associate it w/ the "through" model
    model = Orb.data_scopes.through
    readonly_fields = ("is_active", )
    extra = 0

    def is_active(self, instance):
        return instance.datascope.is_active

    is_active.boolean = True


class OrbImageAdminInline(admin.TabularInline):
    model = OrbImage
    extra = 0


class DocumentAdminInlineForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = (
            "name",
            "version",
            "file",
            "type",
            "n_agreements",
            "is_active",
        )

    n_agreements = forms.CharField(
        disabled=True,
        widget=forms.TextInput(attrs={"size": 1}),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        document = self.instance
        if document:
            self.fields["n_agreements"].initial = document.n_agreements

    def clean(self):
        cleaned_data = super().clean()

        other_documents = Document.objects.exclude(pk=self.instance.pk)

        # Check `unique_type_name_version_orb` and `unique_type_name_version` constraints.
        if other_documents.filter(
            type=cleaned_data["type"],
            name=cleaned_data["name"],
            version=cleaned_data["version"],
            orb=cleaned_data["orb"],
        ).exists():
            raise ValidationError("`type`, `name` and `orb` must be unique")

        # Check `unique_type_name_orb_active and `unique_type_name_active` constraints.
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


class DocumentAdminInline(admin.TabularInline):
    form = DocumentAdminInlineForm
    model = Document
    show_change_link = True
    verbose_name_plural = "ORB DOCUMENTS"
    verbose_name = "ORB DOCUMENT"
    extra = 0


##########
# admins #
##########


@admin.register(DataScope)
class DataScopeAdmin(admin.ModelAdmin):
    fields = (
        "is_active",
        "authority",
        "namespace",
        "name",
        "version",
        "description",
        "applications",
        "orbs",
    )
    list_display = (
        "source_id_pattern",
        "get_orbs_for_list_display",
        "applications",
        "is_active",
    )
    list_editable = ("is_active", )
    list_filter = ("orbs", )
    search_fields = (
        "authority",
        "namespace",
        "name",
        "version",
    )
    filter_horizontal = ("orbs", )

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # also explicitly sorting the instances on source_id_pattern
        queryset = super().get_queryset(request)
        queryset = queryset.order_by(
            Concat(
                F("authority"),
                Value("/"),
                F("namespace"),
                Value("/"),
                F("name"),
                Value("/"),
                F("version")
            )
        )
        return queryset.prefetch_related("orbs")

    def get_orbs_for_list_display(self, obj):
        return get_clickable_m2m_list_display(Orb, obj.orbs.all())

    get_orbs_for_list_display.short_description = "orbs"


@admin.register(Orb)
class OrbAdmin(admin.ModelAdmin):
    form = OrbAdminForm
    inlines = (
        OrbImageAdminInline,
        DocumentAdminInline,
        DataScopeAdminInline,
    )
    list_display = (
        "name",
        "is_active",
    )
    list_editable = ("is_active", )
    list_filter = (
        "is_active",
        "is_default",
    )
    search_fields = ("name", )

    def save_model(self, request, obj, form, change):

        # Just popup a warning if `is_default` is True but `is_hidden` is False b/c
        # that's kind of a weird thing to do; It means that licences to this Orb will
        # be updated automatically, but users will still be notified of those updates

        if obj.is_default and not obj.is_hidden:
            msg = f"The Orb \"<a href='{urlquote(request.path)}'>{obj}</a>\" is set to be default but visible.  Are you sure about that?"
            self.message_user(request, format_html(msg), level=messages.WARNING)

        return super().save_model(request, obj, form, change)


@admin.register(Licence)
class LicenceAdmin(admin.ModelAdmin):
    form = AccessForm
    fields = (
        "id",
        "order_item",
        "orb",
        "customer",
        "customer_user",
        "access",
        "created",
        "modified",
    )
    readonly_fields = (
        "id",
        "created",
        "modified",
    )
    list_display = (
        "id",
        "created",
        "modified",
        "get_orb_for_list_display",
        "get_customer_for_list_display",
        "get_customer_user_for_list_display",
    )
    list_filter = (
        "orb",
        "customer",
        "created",
        "modified",
    )
    ordering = ("modified", )
    search_fields = (
        "id",
        "orb__name",
        "customer__name",
        "customer__official_name",
        "customer_user__user__name",
        "customer_user__user__email",
        "customer_user__user__username",
    )

    def get_orb_for_list_display(self, obj):
        orb = obj.orb
        admin_change_url_name = f"admin:{Orb._meta.db_table}_change"
        list_display = (
            f"<a href='{reverse(admin_change_url_name, args=[orb.pk])}'>{orb.name}</a>"
        )
        return format_html(list_display)

    get_orb_for_list_display.short_description = "orb"

    def get_customer_for_list_display(self, obj):
        customer = obj.customer
        admin_change_url_name = f"admin:{LicencedCustomer._meta.db_table}_change"
        list_display = f"<a href='{reverse(admin_change_url_name, args=[customer.pk])}'>{customer.name}</a>"
        return format_html(list_display)

    get_customer_for_list_display.short_description = "customer"

    def get_customer_user_for_list_display(self, obj):
        customer_user = obj.customer_user
        if customer_user is not None:
            # (there is no admin for a CustomerUser; so this link just goes to User)
            user = customer_user.user
            admin_change_url_name = f"admin:{User._meta.db_table}_change"
            list_display = f"<a href='{reverse(admin_change_url_name, args=[user.pk])}'>{customer_user}</a>"
            return format_html(list_display)

    get_customer_user_for_list_display.short_description = "customer_user"
