from rest_framework import viewsets
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser, FileUploadParser
from rest_framework.permissions import IsAuthenticated

from maps.models import Bookmark
from maps.serializers import BookmarkSerializer


class BookmarkViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]
    # the client sends data as multipart/form data
    parser_classes = [MultiPartParser, FormParser]

    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer

    def get_queryset(self):
        # restrict the queryset to those bookmarks owned by the current user
        user = self.request.user
        return user.bookmarks.all()
