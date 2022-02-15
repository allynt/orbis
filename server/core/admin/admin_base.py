from functools import partial

from django.conf import settings
from django.contrib.admin import AdminSite


def has_admin_site_permission(request, group_names=[]):
    """
    Returns a boolean indicating whether or not a user has permission to access an AdminSite.
    Just like the built-in AdminSite.has_permission function, except also checks for memebership
    in an arbitrary list of groups.  The idea is that only a User w/ membership in the "CoreAdminGroup"
    should have access to core_admin_site and so on.
    """
    user = request.user
    permission = user.is_active and user.is_staff
    in_groups = [
        user.groups.filter(name=group_name).exists()
        for group_name in group_names
    ]
    return permission and all(in_groups)


# these two fns set the permissions on the DefaultAdminSite
# (set in urls.py) and the CoreAdminSite (set below)

default_admin_site_has_permission = partial(
    has_admin_site_permission, group_names=["AdminGroup"]
)
core_admin_site_has_permission = partial(
    has_admin_site_permission, group_names=["CoreAdminGroup"]
)


class CoreAdminSite(AdminSite):
    """
    A secondary admin site to expose some but not all models
    """
    site_header = f"CORE: {settings.ADMIN_SITE_HEADER}"
    site_title = f"CORE: {settings.ADMIN_SITE_TITLE}"
    index_title = f"CORE: {settings.ADMIN_INDEX_TITLE}"

    has_permission = core_admin_site_has_permission


core_admin_site = CoreAdminSite(name="core_admin")
