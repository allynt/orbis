import json
import logging

from django.core.exceptions import ImproperlyConfigured

from rest_framework.utils import encoders

from astrosat_users.views import LoginView as AstrosatUsersLoginView, RegisterView as AstrosatUserRegisterView

from orbis.models import Document

db_logger = logging.getLogger("db")


class LoginView(AstrosatUsersLoginView):
    @property
    def privacy_document_name(self):
        return "general_privacy"

    @property
    def terms_document_name(self):
        return "user_terms"

    def get_success_response(self):

        if "accepted_terms" in self.request.data and self.user.accepted_terms:
            # if the user accepted the terms and privacy policy during registration
            # then create a record of those agreements...

            self.user.documents.add(
                Document.objects.terms().no_orbs().active().get(
                    name=self.terms_document_name
                ),
                Document.objects.privacy().no_orbs().active().get(
                    name=self.privacy_document_name
                ),
            )

        response = super().get_success_response()

        # log this event in the db & analytics elasticsearch
        user = self.user
        customer = user.customers.first()

        event = {
            "type": "orbisUserAction",
            "orbisUserAction": {
                "action": "userLogin",
                "userId": user.uuid,
                "customerId": customer.id if customer else None,
                "customerName": customer.name if customer else None,
            }
        }

        db_logger.info(
            json.dumps(event, cls=encoders.JSONEncoder),
            extra={"tags": ["USER_LOGIN"]},
        )

        return response


class RegisterView(AstrosatUserRegisterView):
    @property
    def privacy_document_name(self):
        return "general_privacy"

    @property
    def terms_document_name(self):
        return "customer_terms"

    def perform_create(self, serializer):
        user = super().perform_create(serializer)

        if user.accepted_terms:
            # if the user accepted the terms and privacy policy during registration
            # then create a record of those agreements...
            user.documents.add(
                Document.objects.terms().no_orbs().active().get(
                    name=self.terms_document_name
                ),
                Document.objects.privacy().no_orbs().active().get(
                    name=self.privacy_document_name
                ),
            )

        return user
