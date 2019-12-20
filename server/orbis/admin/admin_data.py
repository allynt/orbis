from django.contrib import admin
from django.forms import CheckboxSelectMultiple, IntegerField, ModelForm

from astrosat.admin import get_clickable_m2m_list_display
from astrosat_users.models import User, UserRole

from orbis.models import DataScope, RoleAccess, OwnerAccess, Access


class AccessFormField(IntegerField):
    def __init__(self, *args, **kwargs):
        choices = kwargs.pop("choices", ())
        kwargs["widget"] = CheckboxSelectMultiple(choices=choices)
        super().__init__(*args, **kwargs)

    def prepare_value(self, value):
        # takes an integer and returns a list
        int_value = super().prepare_value(value) or 0
        list_value = [
            2 ** i
            for i, b in enumerate(map(int, reversed(bin(int_value)[2:])))
            if b
        ]
        return list_value

    def clean(self, value):
        # takes a list and retuns an integer
        int_value = sum(map(int, value))
        return super().clean(int_value)


class RoleAccessAdminForm(ModelForm):
    class Meta:
        model = RoleAccess
        fields = ["data_scope", "role", "access"]

    access = AccessFormField(choices=Access.choices())


class OwnerAccessAdminForm(ModelForm):
    class Meta:
        model = OwnerAccess
        fields = ["data_scope", "owner", "access"]

    access = AccessFormField(choices=Access.choices())


class RoleAccessAdminInline(admin.TabularInline):
    model = RoleAccess
    form = RoleAccessAdminForm
    extra = 0


class OwnerAccessAdminInline(admin.TabularInline):
    model = OwnerAccess
    form = OwnerAccessAdminForm
    extra = 0


@admin.register(DataScope)
class DataScopeAdmin(admin.ModelAdmin):

    inlines = [RoleAccessAdminInline, OwnerAccessAdminInline]
    list_display = (
        "source_id",
        "get_roles_for_list_display",
        "get_owners_for_list_display",
        "is_active",
    )
    list_filter = (
        "roles",
        "owners",
    )

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # to avoid the "n+1" problem
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("roles", "owners")

    def get_roles_for_list_display(self, obj):
        return get_clickable_m2m_list_display(UserRole, obj.roles.all())

    get_roles_for_list_display.short_description = "roles"

    def get_owners_for_list_display(self, obj):
        return get_clickable_m2m_list_display(User, obj.owners.all())

    get_owners_for_list_display.short_description = "owners"
