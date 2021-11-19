from django.urls import include, path

from rest_framework.routers import SimpleRouter

from .views import AoiViewSet, BookmarkViewSet

##############
# api routes #
##############

api_router = SimpleRouter()
api_router.register(r"bookmarks", BookmarkViewSet, basename="bookmark")
api_router.register(r"aois", AoiViewSet, basename="aoi")
api_urlpatterns = [
    path("", include(api_router.urls)),
]

#################
# normal routes #
#################

urlpatterns = []
