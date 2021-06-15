from django.urls import include, path

from rest_framework.routers import SimpleRouter

from .views import ProxyDataSourceView

##############
# api routes #
##############

api_urlpatterns = [
    path(
        "proxy/data/<slug:authority>/<slug:namespace>/<slug:name>/<slug:version>/",
        ProxyDataSourceView.as_view(),
        name="proxy-data-source"
    ),
]

#################
# normal routes #
#################

urlpatterns = []
