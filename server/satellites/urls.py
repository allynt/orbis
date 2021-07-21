from django.urls import include, path

from astrosat.routers import SlashlessSimpleRouter

from .views import (
    SatelliteViewSet,
    SatelliteDataSourceViewSet,
    run_satellite_query,
) # yapf: disable

##############
# api routes #
##############

api_router = SlashlessSimpleRouter()
api_router.register(r"satellites", SatelliteViewSet, basename="satellite")
api_router.register(
    r"customers/(?P<customer_id>[^/.]+)/users/(?P<user_id>[^/.]+)/satellites/datasources",
    SatelliteDataSourceViewSet,
    basename="satellite-data-source"
)
api_urlpatterns = [
    path(
        "satellites/run_query/",
        run_satellite_query,
        name="satellite-run-query"
    ),
    path("", include(api_router.urls)),
]

#################
# normal routes #
#################

urlpatterns = []
