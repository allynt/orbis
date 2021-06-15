import requests

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext as _

from rest_framework import status

from proxy.adapters import PROXY_DATA_ADAPTER_REGISTRY

###########
# helpers #
###########


def validate_proxy_params(value):
    """
    validate that proxy_params is a dictionary of strings
    """
    if not isinstance(value, dict):
        raise ValidationError("proxy_params must be a JSON object")

    if not all([
        isinstance(k, str) and isinstance(v, str) for k, v in value.items()
    ]):
        raise ValidationError("proxy_params can only contain strings")


########################
# managers & querysets #
########################


class ProxyDataSourceManager(models.Manager):
    def get_by_natural_key(self, source_id):
        kwargs = {
            key: value
            for key,
            value in zip(
                ["authority", "namespace", "name", "version"],
                source_id.split("/"),
            )
        }
        instance = self.get(**kwargs)
        return instance


class ProxyDataSourceQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)


##########
# models #
##########


class ProxyDataSource(models.Model):
    class Meta:
        app_label = "proxy"
        verbose_name = "Proxy Data Source"
        verbose_name_plural = "Proxy Data Sources"
        constraints = [
            models.UniqueConstraint(
                fields=["authority", "namespace", "name", "version"],
                name="unique_proxy_data_source_id",
            )
        ]

    ProxyMethodType = models.TextChoices("MethodType", ["GET", "POST"])

    objects = ProxyDataSourceManager.from_queryset(ProxyDataSourceQuerySet)()

    authority = models.CharField(max_length=128)
    namespace = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    version = models.CharField(max_length=128)

    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    local_pagination = models.BooleanField(
        default=False, help_text=_("Should the processed data be paginated?")
    )
    remote_pagination = models.BooleanField(
        default=False, help_text=_("Is the raw data paginated?")
    )

    proxy_url = models.URLField(blank=False, null=False)
    proxy_method = models.CharField(
        max_length=16, blank=False, null=False, choices=ProxyMethodType.choices
    )
    proxy_params = models.JSONField(
        blank=True,
        null=True,
        validators=[validate_proxy_params],
        help_text=_(
            "A dictionary of all the parameters to pass to the proxy_url"
            "(including any authentication tokens)"
        )
    )
    # TODO: THIS ASSUMES PROXY AUTHENTICATION IS DONE VIA URL PARAMS
    # TODO: SHOULD ADD SUPPORT FOR ADDING TOKEN IN HEADERS
    # TODO: proxy_authentication_method = whatever...

    adapter_name = models.CharField(
        max_length=64,
        blank=False,
        null=False,
        help_text=_(
            "The name of the adapter that contains the specific fns used by this ProxyDataSource"
        )
    )

    def __str__(self):
        return self.source_id

    @property
    def adapter(self):
        return PROXY_DATA_ADAPTER_REGISTRY[self.adapter_name]

    @property
    def source_id(self):
        return f"{self.authority}/{self.namespace}/{self.name}/{self.version}"

    def natural_key(self):
        return (self.source_id, )

    def get_data(self):
        # TODO: REMOTE PAGINATION
        response = requests.request(
            self.proxy_method,
            self.proxy_url,
            params=self.proxy_params,
        )
        response.raise_for_status()
        return response.json()

    def process_data(self, data):
        """
        Given a chunk of JSON, turn it into GeoJSON suitable for orbis
        """
        return self.adapter.process_data(data)
