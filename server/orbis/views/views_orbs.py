from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from orbis.models import Orb
from orbis.serializers import OrbSerializer


class OrbListView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = OrbSerializer
    queryset = Orb.objects.active()
