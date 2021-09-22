from astrosat.decorators import swagger_fake

from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from orbis.models import DataStorage
from orbis.serializers import DataStorageSerializer


class DataStorageViewSet(
    mixins.ListModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class = DataStorageSerializer

    @swagger_fake(DataStorage.objects.none())
    def get_queryset(self):
        """
        Filter the DataStorage objects per user
        """
        current_user = self.request.user
        return current_user.storage.all()
