from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError

from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from astrosat.decorators import swagger_fake

from maps.models import Aoi
from maps.serializers import AoiSerializer


class AoiViewSet(ModelViewSet):
    """ Viewset for AOIs """
    parser_classes = [
        MultiPartParser, FormParser
    ]  # the client sends data as multipart/form data
    serializer_class = AoiSerializer
    permission_classes = [IsAuthenticated]

    @swagger_fake(Aoi.objects.none())
    def get_queryset(self):
        """ Order the AOIs by created date. """
        user = self.request.user
        return user.aois.all().order_by('-created')
