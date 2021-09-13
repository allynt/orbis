import json
import logging

from django.core.exceptions import ImproperlyConfigured

from rest_framework.utils import encoders

from astrosat_users.views import LoginView as AstrosatUsersLoginView, RegisterView as AstrosatUserRegisterView

from orbis.models import Document

db_logger = logging.getLogger("db")


class LoginView(AstrosatUsersLoginView):
    def get_success_response(self):

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
    def perform_create(self, serializer):
        user = super().perform_create(serializer)

        if user.accepted_terms:
            # if the user accepted the terms during registration
            # then create a record of that agreement...
            terms_document = Document.objects.terms().no_orbs().active().first()
            if not terms_document:
                raise ImproperlyConfigured("Cannot find active terms Document")
            user.documents.add(terms_document)

        return user
