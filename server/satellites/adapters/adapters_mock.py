from django.conf import settings

from .adapters_base import BaseSatelliteAdapter
"""
a mock adapter just for testing
"""


class MockAdapter(BaseSatelliteAdapter):

    name = "mock-adapter"

    def run_query(self, **kwargs):
        results = []
        return results
