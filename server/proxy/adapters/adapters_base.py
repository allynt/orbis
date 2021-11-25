from typing import Any, Optional, Tuple

from django.core.exceptions import ImproperlyConfigured
from django.http import QueryDict

##################
# error-handling #
##################


class ProxyDataException(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


############
# registry #
############


class ProxyDataAdapterRegistry(dict):
    """
    The registry is just a dictionary w/ some clever
    indirection for accessing contents.
    """

    key = None

    def __init__(self, *args, **kwargs):
        self.key = kwargs.pop("key")
        super().__init__(*args, **kwargs)

    def __missing__(self, key):
        raise ImproperlyConfigured(
            f"No Adapter has been registered w/ the key '{key}'."
        )

    def __getitem__(self, obj) -> 'BaseProxyDataAdapter':
        # you can either access the registry w/ an object
        # (which has a key attribute), or the key itself
        key = getattr(obj, self.key, obj)
        return super().__getitem__(key)

    def register(self, obj):
        try:
            key = getattr(obj, self.key)
            self[key] = obj()
        except AttributeError:
            raise NotImplementedError(
                f"'{self.key}' is a required attribute of '{obj}'"
            )

    def unregister(self, obj):
        key = getattr(obj, self.key, obj)
        try:
            self.pop(key)
        except KeyError:
            raise ImproperlyConfigured(
                f"No Adapter has been registered w/ the key '{key}'"
            )


PROXY_DATA_ADAPTER_REGISTRY = ProxyDataAdapterRegistry(key="name")

##############
# base class #
##############


class ProxyDataAdapterMetaClass(type):

    # this metaclass registers any classes that inherit from BaseProxyDataAdapter
    # as per: https://stackoverflow.com/questions/5189232/how-to-auto-register-a-class-when-its-defined/5189271#5189271

    def __new__(cls, name, superclass, attrs):
        """
        When a new ProxyDataAdapter is defined, add it to the registry.
        """
        NewProxyDataAdapterClass = super().__new__(cls, name, superclass, attrs)

        if (
            object not in superclass
        ):  # prevents BaseProxyDataAdapter itself from being registered
            PROXY_DATA_ADAPTER_REGISTRY.register(NewProxyDataAdapterClass)

        return NewProxyDataAdapterClass


class BaseProxyDataAdapter(object, metaclass=ProxyDataAdapterMetaClass):

    name = None

    def __str__(self):
        return f"{self.name}"

    def process_data(self, *args, **kwargs):
        raise NotImplementedError(
            f"{self.__class__} must implement the 'process_data' method."
        )
