from django.urls import include, path

from rest_framework.routers import SimpleRouter

from .views import (
    DataView,
    TokenView,
    SatelliteViewSet,
    SatelliteSearchViewSet,
    SatelliteResultViewSet,
    run_satellite_query,
)


##############
# api routes #
##############

api_router = SimpleRouter()
api_router.register(r"satellites/searches", SatelliteSearchViewSet, basename="satellite-search")
api_router.register(r"satellites/results", SatelliteResultViewSet, basename="satellite-result")
api_router.register(r"satellites", SatelliteViewSet, basename="satellite")
api_urlpatterns = [
    path("satellites/run_query", run_satellite_query, name="satellite-run-query"),
    path("data/sources/", DataView.as_view(), name="data"),
    path("data/token/", TokenView.as_view(), name="token"),
    path("", include(api_router.urls)),
]


#################
# normal routes #
#################

urlpatterns = []
