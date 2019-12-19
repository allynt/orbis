from django.contrib import admin

from astrosat.admin import get_clickable_m2m_list_display
from astrosat_users.models import User, UserRole

from orbis.models import DataScope, DataScopeRoleAccess, DataScopeOwnerAccess


class DataScopeRoleAccessAdminInline(admin.TabularInline):
    model = DataScopeRoleAccess
    extra = 1


class DataScopeOwnerAccessAdminInline(admin.TabularInline):
    model = DataScopeOwnerAccess
    extra = 1


@admin.register(DataScope)
class DataScopeAdmin(admin.ModelAdmin):

    inlines = [DataScopeRoleAccessAdminInline, DataScopeOwnerAccessAdminInline]
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
