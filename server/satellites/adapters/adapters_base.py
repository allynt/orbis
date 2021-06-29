from django.core.exceptions import ImproperlyConfigured


############
# registry #
############


class AdapterRegistry(dict):
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

    def __getitem__(self, obj):
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


SATELLITE_ADAPTER_REGISTRY = AdapterRegistry(key="satellite_id")


##############
# base class #
##############


class SatelliteAdapterMetaClass(type):

    # this metaclass registers any classes that inherit from BaseSatelliteAdapter
    # as per: https://stackoverflow.com/questions/5189232/how-to-auto-register-a-class-when-its-defined/5189271#5189271

    def __new__(cls, name, superclass, attrs):
        """
        When a new SatelliteAdapter is defined, add it to the registry.
        """
        NewSatelliteAdapterClass = super().__new__(cls, name, superclass, attrs)

        if (
            object not in superclass
        ):  # prevents BaseSatelliteAdapter itself from being registerd
            SATELLITE_ADAPTER_REGISTRY.register(NewSatelliteAdapterClass)

        return NewSatelliteAdapterClass


class BaseSatelliteAdapter(object, metaclass=SatelliteAdapterMetaClass):

    query_params = {}

    def setup(self, *args, **kwargs):
        self.query_params = kwargs

    def run_satellite_query(self, **kwargs):
        raise NotImplementedError(
            f"{self.__class__} must implement the 'run_satellite_query' method."
        )
