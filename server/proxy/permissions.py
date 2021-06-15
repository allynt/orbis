from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.utils import datetime_from_epoch

from dat_utils.dat import check_payload_data_scope
from dat_utils.constants import TOKEN_MAX_LIFETIME


class DataAccessToken(UntypedToken):
    def verify(self):
        self.check_exp()
        self.check_lifetime()

    def check_lifetime(self, exp_claim="exp", iat_claim="iat"):

        try:
            exp_value = self.payload[exp_claim]
        except KeyError:
            raise TokenError(f"Token has no '{exp_claim}' claim.")

        try:
            iat_value = self.payload[iat_claim]
        except KeyError:
            raise TokenError(f"Token has no '{iat_claim}' claim.")

        claim_lifetime = datetime_from_epoch(exp_value
                                            ) - datetime_from_epoch(iat_value)

        if claim_lifetime > TOKEN_MAX_LIFETIME:
            raise TokenError("Token exceeds maximum lifetime")


def CanTokenAccessData(get_source_id, verb="read"):
    """
    This fn is a factory that returns a _dynamic_ DRF Permission based on a given source_id.
    Only a request w/ a token that matches that source_id is granted permission.
    """
    class _CanTokenAccessData(BasePermission):
        def has_permission(self, request, view):

            if callable(get_source_id):
                source_id = get_source_id(request)
            else:
                source_id = get_source_id

            token = request.auth
            if token and check_payload_data_scope(
                token.payload, source_id, verb=verb
            ):
                return True

            raise PermissionDenied(
                f"DataAccessToken does not have '{verb}' access to '{source_id}'."
            )

    return _CanTokenAccessData
