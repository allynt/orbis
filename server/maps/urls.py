from django.urls import include, path

from rest_framework.routers import SimpleRouter

from .views import BookmarkViewSet, SatelliteViewSet, SatelliteSceneViewSet, SatelliteVisualisationViewSet


##############
# api routes #
##############

api_router = SimpleRouter()
api_router.register(r"bookmarks", BookmarkViewSet, basename="bookmark")
api_router.register(r"satellites/visualisations", SatelliteVisualisationViewSet, basename="satellite-visualisation")
api_router.register(r"satellites/scenes", SatelliteSceneViewSet, basename="satellite-scene")
api_router.register(r"satellites", SatelliteViewSet, basename="satellite")
api_urlpatterns = [
    path("", include(api_router.urls)),
]


#################
# normal routes #
#################

urlpatterns = []
