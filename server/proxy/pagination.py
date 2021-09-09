from collections import OrderedDict

from rest_framework import pagination
from rest_framework.response import Response

PAGE_SIZE = 100


class LocalPagination(pagination.PageNumberPagination):

    page_size_query_param = 'page_size'
    page_size = PAGE_SIZE

    def paginate(self, feature_collection, request, view=None):
        return super().paginate_queryset(
            feature_collection["features"], request, view=view
        )

    def get_paginated_response(self, features):
        return Response(
            OrderedDict([
                ('type', 'FeatureCollection'),
                ('count', self.page.paginator.count),
                ('pages', self.page.paginator.num_pages),
                ('previous', self.get_previous_link()),
                ('next', self.get_next_link()),
                ('features', features),
            ])
        )
