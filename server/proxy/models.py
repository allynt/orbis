from typing import Any, Optional
import requests

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext as _
from django.http import QueryDict

from rest_framework import status

from proxy.adapters import PROXY_DATA_ADAPTER_REGISTRY
from proxy.authentication import ProxyAuthentication

###########
# helpers #
###########


def validate_dict(value, field_name=None):
    """
    validate that value is a dictionary
    """
    if not isinstance(value, dict):
        raise ValidationError(f"{field_name or ''} must be a JSON object")


def validate_proxy_params(value):
    return validate_dict(value, field_name="proxy_params")


def validate_proxy_headers(value):
    return validate_dict(value, field_name="proxy_headers")


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

    class ProxyRequestStrategy(models.TextChoices):
        STORED_PARAMS_ONLY = "STORED_PARAMS_ONLY"
        REQUEST_ONLY = "REQUEST_ONLY"

    ProxyMethodType = models.TextChoices("MethodType", ["GET", "POST"])

    objects = ProxyDataSourceManager.from_queryset(ProxyDataSourceQuerySet)()

    _request = None  # (not a field, just an attribute w/ getters/setters below)

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
    timeout = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text=_(
            "Is there a limit on how frequently (in seconds) the remote data source can be accessed?"
        )
    )

    proxy_url = models.URLField(blank=False, null=False)
    proxy_method = models.CharField(
        max_length=16, blank=False, null=False, choices=ProxyMethodType.choices
    )
    proxy_headers = models.JSONField(
        blank=True,
        null=True,
        validators=[validate_proxy_headers],
        help_text=_(
            "A dictionary of any extra headers to include in the request to the proxy_url "
        )
    )

    proxy_authentication_type = models.CharField(
        max_length=16,
        blank=True,
        null=True,
        choices=ProxyAuthentication.AuthenticationTypes.choices,
        help_text=_(
            "The type of authentication to implement. "
            "(Note that if URL_PARAM is selected, it is assumed that the authentication token appears in proxy_params.)"
        )
    )
    proxy_authentication_token = models.CharField(
        max_length=512,
        blank=True,
        null=True,
        help_text=_(
            "The authentication token (for Bearer or ApiKey Authentication)."
        )
    )
    proxy_authentication_username = models.CharField(
        max_length=256,
        blank=True,
        null=True,
        help_text=_("The authentication username (for Basic Authentication).")
    )
    proxy_authentication_password = models.CharField(
        max_length=256,
        blank=True,
        null=True,
        help_text=_("The authentication password (for Basic Authentication).")
    )

    proxy_params = models.JSONField(
        blank=True,
        null=True,
        validators=[validate_proxy_params],
        help_text=_(
            "A dictionary of all the parameters to pass to the proxy_url "
            "(including any authentication tokens)"
        )
    )

    request_strategy = models.TextField(
        blank=False,
        null=False,
        choices=ProxyRequestStrategy.choices,
        default=ProxyRequestStrategy.STORED_PARAMS_ONLY,
    )

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
    def request(self):
        return self._request

    @request.setter
    def request(self, value):
        self._request = value

    @property
    def adapter(self):
        return PROXY_DATA_ADAPTER_REGISTRY[self.adapter_name]

    @property
    def source_id(self):
        return f"{self.authority}/{self.namespace}/{self.name}/{self.version}"

    def natural_key(self):
        return (self.source_id, )

    def get_data(
        self,
        request_query_params: QueryDict,
        request_body_data: Any,
    ):
        """
        Requests data from the proxied API
        """

        upstream_query_params = None
        upstream_body_data = None

        # Use the request strategy to determine what query params & body to send upstream
        if self.request_strategy == self.ProxyRequestStrategy.STORED_PARAMS_ONLY:

            if self.proxy_method == "POST":
                upstream_query_params = None
                upstream_body_data = self.proxy_params

            else:
                upstream_query_params = self.proxy_params
                upstream_body_data = None

        elif self.request_strategy == self.ProxyRequestStrategy.REQUEST_ONLY:
            upstream_query_params = request_query_params
            upstream_body_data = request_body_data

        # TODO: REMOTE PAGINATION
        response = requests.request(
            self.proxy_method,
            self.proxy_url,
            auth=ProxyAuthentication(self),
            headers=self.proxy_headers,
            params=upstream_query_params,
            json=upstream_body_data,
            verify=False,  ## FIXME ## Remove once IR API supports real SSL cert
        )

        response.raise_for_status()
        return response.json()

    def process_data(self, data):
        """
        Takes the data returned by `get_data` and turns it into GeoJSON suitable for orbis
        """
        return self.adapter.process_data(data)
