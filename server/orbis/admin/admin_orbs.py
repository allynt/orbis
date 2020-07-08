from django.contrib import admin
from django.forms import CheckboxSelectMultiple, IntegerField, ModelForm
from django.urls import reverse
from django.utils.html import format_html

from astrosat.admin import get_clickable_m2m_list_display
from astrosat_users.models import Customer

from orbis.models import Orb, License, DataScope, Access


##############################
# pretty ui for access flags #
##############################


class AccessFormField(IntegerField):
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
            2 ** i for i, b in enumerate(map(int, reversed(bin(int_value)[2:]))) if b
        ]
        return list_value

    def clean(self, value):
        # takes a list and retuns an integer
        int_value = sum(map(int, value))
        return super().clean(int_value)


class AccessForm(ModelForm):

    access = AccessFormField(initial=Access.READ, choices=Access.choices())


###########
# inlines #
###########


class DataScopeAdminInline(admin.TabularInline):
    # in theory, you can't use an inline w/ m2m
    # so I associate it w/ the "through" model
    model = Orb.data_scopes.through
    readonly_fields = ("is_active",)
    extra = 0

    def is_active(self, instance):
        return instance.datascope.is_active

    is_active.boolean = True


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
        "orbs",
    )
    list_display = (
        "source_id_pattern",
        "get_orbs_for_list_display",
        "is_active",
    )
    list_editable = ("is_active",)
    list_filter = ("orbs",)
    search_fields = (
        "authority",
        "namespace",
        "name",
        "version",
    )
    filter_horizontal = ("orbs",)

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # to avoid the "n+1" problem
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("orbs")

    def get_orbs_for_list_display(self, obj):
        return get_clickable_m2m_list_display(Orb, obj.orbs.all())

    get_orbs_for_list_display.short_description = "orbs"


@admin.register(Orb)
class OrbAdmin(admin.ModelAdmin):
    inlines = (DataScopeAdminInline,)
    list_display = (
        "name",
        "is_active",
    )
    list_editable = ("is_active",)
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    fields = (
        "id",
        "orb",
        "customer",
        "customer_user",
        "access",
    )
    readonly_fields = ("id",)
    form = AccessForm
    list_display = (
        "id",
        "get_orb_for_list_display",
        "get_customer_for_list_display",
    )
    list_filter = (
        "orb",
        "customer",
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
        admin_change_url_name = f"admin:{Customer._meta.db_table}_change"
        list_display = f"<a href='{reverse(admin_change_url_name, args=[customer.pk])}'>{customer.name}</a>"
        return format_html(list_display)

    get_customer_for_list_display.short_description = "customer"