from rest_framework.exceptions import ValidationError

from astrosat_users.serializers import (
    LoginSerializer as AstrosatUsersLoginSerializer,
    RegisterSerializer as AstrosatUsersRegisterSerializer,
)

from orbis.models import LicencedCustomer, Orb, Document
from maps.models import MapStyle

class ValidateDocumentsExistMixin():
    """
    Makes sure that if a user accepted a document,
    that document actually exists in the db.
    """
    def validate_accepted_terms(self, value):

        if value:
            terms_document = Document.objects.terms().no_orbs().active().filter(
                name=self.terms_document_name
            )
            privacy_document = Document.objects.privacy().no_orbs().active(
            ).filter(name=self.privacy_document_name)

            if not terms_document and not privacy_document:
                raise ValidationError(
                    "Cannot find active Terms and Privacy Document"
                )
            elif not terms_document:
                raise ValidationError("Cannot find active Terms Document")
            elif not privacy_document:
                raise ValidationError("Cannot find active Privacy Document")

        return value


class RegisterSerializer(
    ValidateDocumentsExistMixin, AstrosatUsersRegisterSerializer
):
    """
    Overwrites the default RegisterSerializer b/c if I create a Customer
    as part of registration, I want to make sure that in orbis I also
    create any default licences for the associated CustomerUser.
    """
    @property
    def privacy_document_name(self):
        return "general_privacy"

    @property
    def terms_document_name(self):
        return "customer_terms"

    def custom_signup(self, request, user):

        # This creates customer & customer_user (if "customer_name" was passed to the serializer)
        super().custom_signup(request, user)

        customer_name = self.validated_data.get("customer_name")
        if customer_name:
            # If customer & customer_user were created, then add any default licences.
            # (This duplicates code that runs when a customer_user is created by the
            # DRF "customer_users_create" View instead of here during registration.)
            licenced_customer = LicencedCustomer.objects.get(name=customer_name)
            customer_user_qs = licenced_customer.customer_users.filter(
                user=user
            )
            for default_orb in Orb.objects.active().default(
            ):  # TODO: THE SET OF DEFAULT ORBS SHOULD EVENTUALLY VARY ACCORDING TO OrbisUserProfile

                licenced_customer.assign_licences(
                    default_orb,
                    customer_user_qs,
                    add_missing=True,
                    ignore_existing=False
                )

            # Add MapStyle instances to Customer.
            map_styles = MapStyle.objects.filter(is_default=True)
            licenced_customer.map_styles.add(*map_styles)


class LoginSerializer(
    ValidateDocumentsExistMixin, AstrosatUsersLoginSerializer
):
    @property
    def privacy_document_name(self):
        return "general_privacy"

    @property
    def terms_document_name(self):
        return "user_terms"
