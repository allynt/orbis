from base64 import b64encode
from requests.auth import AuthBase, HTTPBasicAuth

from django.db.models import TextChoices


class ProxyAuthentication(AuthBase):
    AuthenticationTypes = TextChoices(
        # TODO: ADD OTHER TYPES
        "AuthenticationTypes",
        ["BASIC", "BEARER", "APIKEY", "URL_PARAM", "API_ALLOWREQUEST"]
    )

    def __init__(self, proxy_data_source):
        self.proxy_data_source = proxy_data_source

    def __call__(self, request):
        proxy_authentication_type = self.proxy_data_source.proxy_authentication_type
        if not proxy_authentication_type:
            return request

        if proxy_authentication_type == self.AuthenticationTypes.URL_PARAM:
            pass

        elif proxy_authentication_type == self.AuthenticationTypes.BASIC:
            HTTPBasicAuth(
                self.proxy_data_source.proxy_authentication_username,
                self.proxy_data_source.proxy_authentication_password,
            )(request)

        elif proxy_authentication_type == self.AuthenticationTypes.BEARER:
            request.headers[
                "Authorization"
            ] = "Bearer " + self.proxy_data_source.proxy_authentication_token

        elif proxy_authentication_type == self.AuthenticationTypes.APIKEY:
            request.headers[
                "Authorization"
            ] = "api-key " + self.proxy_data_source.proxy_authentication_token

        elif proxy_authentication_type == self.AuthenticationTypes.API_ALLOWREQUEST:
            request.headers[
                "X-API-AllowRequest"
            ] = self.proxy_data_source.proxy_authentication_token

        else:
            raise NotImplementedError(proxy_authentication_type)

        return request
