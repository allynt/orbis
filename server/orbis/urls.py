from django.urls import include, path

from rest_framework.routers import SimpleRouter

from .views import TokenView, DataView

##############
# api routes #
##############

api_router = SimpleRouter()
api_urlpatterns = [
    path("", include(api_router.urls)),
    path("data/sources/", DataView.as_view(), name="data"),
    path("data/token/", TokenView.as_view(), name="token"),
]


#################
# normal routes #
#################

urlpatterns = []
