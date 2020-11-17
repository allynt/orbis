import collections
import pytest
import requests

from django.conf import settings

from rest_framework import status


class MockDataSourceResponse:

    def __init__(self, source_ids, status):
        self.status = status
        self.data = [
            dict([
                # just the bare minimum of serialized content
                ("source_id", source_id),
                ("metadata", { "application": {}})
            ])
            for source_id in source_ids
        ]

    @property
    def status_code(self):
        return self.status

    def json(self):
        return {"results": self.data}


@pytest.fixture
def mock_data_sources(monkeypatch):
    """
    Mocks the data-sources-directory responses to return the specified source_ids
    """

    def _mock_data_sources(source_ids, status=status.HTTP_200_OK):

        assert isinstance(source_ids, collections.Iterable) and not isinstance(source_ids, str,)

        def _mock_get(url, params=None, **kwargs):
            if url.startswith(settings.DATA_SOURCES_DIRECTORY_URL):
                return MockDataSourceResponse(source_ids=source_ids, status=status)
            # this just duplicates the standard `requests.get` behavior
            kwargs.setdefault("allow_redirects", True)
            return requests.request("get", url, params=params, **kwargs)

        monkeypatch.setattr(requests, "get", _mock_get)

    return _mock_data_sources
