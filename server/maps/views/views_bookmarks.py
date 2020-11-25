import functools

from django.http import JsonResponse
from django.utils.decorators import method_decorator

from rest_framework import status, viewsets
from rest_framework.exceptions import APIException
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, BasePermission

from botocore.exceptions import BotoCoreError

from astrosat.decorators import swagger_fake

from maps.models import Bookmark
from maps.serializers import BookmarkSerializer


def check_storage_access(view_fn):
    """
    Gracefully fails if anything storage-related fails in the ViewSet below
    """

    @functools.wraps(view_fn)
    def check_storage_access_wrapper(request, *args, **kwargs):
        try:
            return view_fn(request, *args, **kwargs)
        except BotoCoreError as e:
            data = {"error": str(e)}
            return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return check_storage_access_wrapper


@method_decorator(check_storage_access, name="dispatch")
class BookmarkViewSet(viewsets.ModelViewSet):

    parser_classes = [MultiPartParser, FormParser]  # the client sends data as multipart/form data
    permission_classes = [IsAuthenticated]
    serializer_class = BookmarkSerializer

    @swagger_fake(Bookmark.objects.none())
    def get_queryset(self):
        # restrict the queryset to those bookmarks owned by the current user
        user = self.request.user
        return user.bookmarks.all().order_by("-created")
