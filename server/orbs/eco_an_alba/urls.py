from django.urls import include, path

from rest_framework.routers import SimpleRouter

from orbs.eco_an_alba.views import ProposalViewSet

##############
# api routes #
##############

api_router = SimpleRouter()

api_router.register(r"proposals", ProposalViewSet, basename="proposal")

api_urlpatterns = [
    path("", include(api_router.urls)),
]

#################
# normal routes #
#################

urlpatterns = []
