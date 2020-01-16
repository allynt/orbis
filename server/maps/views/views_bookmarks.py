from django_filters import rest_framework as filters

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, SAFE_METHODS

from maps.models import Bookmark
from maps.serializers import BookmarkSerializer


class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        # anybody can do GET, HEAD, or OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # only the admin or the specific owner can do POST, PUT, PATCH, DELETE
        user = request.user
        return user.is_superuser or user == obj.owner


class BookmarkFilterSet(filters.FilterSet):
    """
    Allows me to filter bookmarks by owner
    # TODO: eventually add a "shared__in" filter
    usage is: <domain>/api/bookmark/?owner=<user.pk>
    """

    class Meta:
        model = Bookmark
        fields = {
            "owner": ["exact"],
            # TODO: eventually add ``"shared": ["in"]` filter
        }


class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = BookmarkFilterSet
