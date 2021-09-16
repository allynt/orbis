from django.utils.functional import cached_property
from django.shortcuts import get_object_or_404

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

    # def destroy(self, request, *args, **kwargs):
    #     # Delete associated DataSource.
    #     print(f"SELF: {self.__dict__}", flush=True)
    #     print(f"REQUEST: {request.__dict__}", flush=True)
    #     print(f"ARGS: {args}", flush=True)
    #     print(f"KWARGS: {kwargs}", flush=True)

    #     super().destroy(request, *args, **kwargs)
