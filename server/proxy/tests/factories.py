import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker when defining factory fields

from astrosat.tests.utils import optional_declaration

from proxy.models import ProxyDataSource


class ProxyDataSourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProxyDataSource

    authority = FactoryFaker("word")
    namespace = FactoryFaker("word")
    name = FactoryFaker("word")
    version = FactoryFaker("word")

    description = optional_declaration(FactoryFaker("text"), chance=50)
    is_active = True

    proxy_url = FactoryFaker("url")
    proxy_method = FactoryFaker(
        "random_element", elements=ProxyDataSource.ProxyMethodType
    )
    proxy_params = FactoryFaker("pydict", value_types=str)
    proxy_headers = None

    adapter_name = "noop"
