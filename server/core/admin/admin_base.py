from django.conf import settings
from django.contrib.admin import AdminSite


class CoreAdminSite(AdminSite):
    """
    A secondary admin site to expose some but not all models
    """
    site_header = f"CORE: {settings.ADMIN_SITE_HEADER}"
    site_title = f"CORE: {settings.ADMIN_SITE_TITLE}"
    index_title = f"CORE: {settings.ADMIN_INDEX_TITLE}"


core_admin_site = CoreAdminSite(name='core_admin')
