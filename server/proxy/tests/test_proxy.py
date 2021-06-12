import pytest

from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from .factories import *


@pytest.mark.django_db
class TestProxyDataSource:
    def test_something(self):
        proxy_data_source = ProxyDataSourceFactory()
        assert True
