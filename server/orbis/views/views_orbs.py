from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from orbis.models import Orb
from orbis.serializers import OrbSerializer


class OrbListView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = OrbSerializer
    queryset = Orb.objects.visible().active()
