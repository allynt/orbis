from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from astrosat.routers import SlashlessSimpleRouter
from astrosat.views import api_schema_views, remove_urlpatterns

from astrosat.urls import (
    urlpatterns as astrosat_urlpatterns,
    api_urlpatterns as astrosat_api_urlpatterns,
)

from astrosat_users.urls import (
    urlpatterns as astrosat_users_urlpatterns,
    api_urlpatterns as astrosat_users_api_urlpatterns,
)

from maps.urls import (
    urlpatterns as maps_urlpatterns,
    api_urlpatterns as maps_api_urlpatterns,
)

from satellites.urls import (
    urlpatterns as satellites_urlpatterns,
    api_urlpatterns as satellites_api_urlpatterns,
)

from proxy.urls import (
    urlpatterns as proxy_urlpatterns,
    api_urlpatterns as proxy_api_urlpatterns,
)

from orbis.urls import (
    urlpatterns as orbis_urlpatterns,
    api_urlpatterns as orbis_api_urlpatterns,
)

from .views import app_config_view

from core.admin import core_admin_site, default_admin_site_has_permission

# a little bit of admin customisation...
admin.site.has_permission = default_admin_site_has_permission
admin.site.site_header = settings.ADMIN_SITE_HEADER
admin.site.site_title = settings.ADMIN_SITE_TITLE
admin.site.index_title = settings.ADMIN_INDEX_TITLE

# a little bit of error customisation...
handler400 = "astrosat.views.handler400"
handler403 = "astrosat.views.handler403"
handler404 = "astrosat.views.handler404"
handler500 = "astrosat.views.handler500"

##############
# api routes #
##############

# orbis replaces some of the default user & customer & customer_user views (to include licenses & orbs)
# it also replaces the default login view to support db logging and the default register view to support terms agreement
astrosat_users_api_urlpatterns = remove_urlpatterns(
    astrosat_users_api_urlpatterns,
    [
        "users-list",
        "users-detail",
        "customers-list",
        "customers-detail",
        "customer-users-list",
        "customer-users-detail",
        "customer-users-invite",
        "customer-users-onboard",
        "rest_login",
        "rest_register",
    ],
)

api_router = SlashlessSimpleRouter()
api_urlpatterns = [
    path("", include(api_router.urls)),
    path("", include(api_schema_views)),
    path("app/config", app_config_view, name="appconfig"),
]
api_urlpatterns += astrosat_api_urlpatterns
api_urlpatterns += astrosat_users_api_urlpatterns
api_urlpatterns += maps_api_urlpatterns
api_urlpatterns += satellites_api_urlpatterns
api_urlpatterns += proxy_api_urlpatterns
api_urlpatterns += orbis_api_urlpatterns

#################
# normal routes #
#################

urlpatterns = [
    # docker healthchecks...
    path("healthcheck/", include("health_check.urls")),

    # admins...
    path(settings.ADMIN_URL, admin.site.urls),
    path("core-admin/", core_admin_site.urls),

    # API...
    path("api/", include(api_urlpatterns)),

    # app-specific patterns...
    path("astrosat/", include(astrosat_urlpatterns)),
    path("users/", include(astrosat_users_urlpatterns)),
    path("maps/", include(maps_urlpatterns)),
    path("satellites/", include(satellites_urlpatterns)),
    path("proxy/", include(proxy_urlpatterns)),
    path("orbis/", include(orbis_urlpatterns)),

    # note: index_view is added at the very end of this module!
]

# media files...
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:

    # allow the error pages to be accessed during development...

    from functools import (
        partial,
    )  # (using partial to pretend an exception has been raised)
    from django.http import (
        HttpResponseBadRequest,
        HttpResponseForbidden,
        HttpResponseNotFound,
    )
    from astrosat.views import handler400, handler403, handler404, handler500

    urlpatterns += [
        path("400/", partial(handler400, exception=HttpResponseBadRequest())),
        path("403/", partial(handler403, exception=HttpResponseForbidden())),
        path("404/", partial(handler404, exception=HttpResponseNotFound())),
        path("500/", handler500
            ),  # "default_views.server_error" doesn't take an exception
    ]

    # enable django-debug-toolbar during development...

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [
            path("__debug__/", include(debug_toolbar.urls))
        ] + urlpatterns
