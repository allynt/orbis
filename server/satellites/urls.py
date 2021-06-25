from django.urls import include, path

from astrosat.routers import SlashlessSimpleRouter

from .views import (
    SatelliteViewSet,
    SatelliteSearchViewSet,
    SatelliteResultViewSet,
    run_satellite_query,
)

# yapf: disable

##############
# api routes #
##############

api_router = SlashlessSimpleRouter()
api_router.register(r"satellites/searches", SatelliteSearchViewSet, basename="satellite-search")
api_router.register(r"satellites/results", SatelliteResultViewSet, basename="satellite-result")
api_router.register(r"satellites", SatelliteViewSet, basename="satellite")
api_urlpatterns = [
    path("satellites/run_query/", run_satellite_query, name="satellite-run-query"),
    path("", include(api_router.urls)),
]

#################
# normal routes #
#################

urlpatterns = []
