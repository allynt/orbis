from rest_framework import viewsets

from astrosat.decorators import swagger_fake

from orbs.eco_an_alba.models import Proposal
from orbs.eco_an_alba.serializers import ProposalSerializer

class ProposalViewSet(viewsets.ModelViewSet):

    permission_classes = []
    serializer_class = ProposalSerializer

    @swagger_fake(Proposal.objects.none())
    def get_queryset(self):
        user = self.request.user
        return user.proposals.all()

