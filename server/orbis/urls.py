from django.urls import include, path

from rest_framework.routers import SimpleRouter

from .views import (
    OrbListView,
    CustomerCreateView,
    CustomerUpdateView,
    CustomerUserListView,
    CustomerUserDetailView,
    CustomerUserInviteView,
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
    path("orbs/", OrbListView.as_view(), name="orbs-list"),
    path("customers/", CustomerCreateView.as_view(), name="customers-list"),
    path("customers/<slug:customer_id>/", CustomerUpdateView.as_view(), name="customers-detail"),
    path("customers/<slug:customer_id>/users/", CustomerUserListView.as_view(), name="customer-users-list"),
    path("customers/<slug:customer_id>/users/<slug:user_id>/", CustomerUserDetailView.as_view(), name="customer-users-detail"),
    path("customers/<slug:customer_id>/users/<slug:user_id>/invite/", CustomerUserInviteView.as_view(), name="customer-users-invite"),
    path("data/sources/", DataView.as_view(), name="data"),
    path("data/token/", TokenView.as_view(), name="token"),
    path("satellites/run_query/", run_satellite_query, name="satellite-run-query"),
    path("", include(api_router.urls)),
]


#################
# normal routes #
#################

urlpatterns = []
