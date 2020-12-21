import json
import logging

from rest_framework.utils import encoders

from astrosat_users.views import LoginView as AstrosatUsersLoginView

db_logger = logging.getLogger("db")


class LoginView(AstrosatUsersLoginView):
    def get_success_response(self):

        response = super().get_success_response()

        # log this event in the db...
        user = self.user
        customer = user.customers.first()
        user_data = {
            "userId": user.uuid,
            "customerId": customer.id if customer else None,
            "customerName": customer.name if customer else None,
        }
        db_logger.info(
            json.dumps(user_data, cls=encoders.JSONEncoder),
            extra={"tags": ["USER_LOGIN"]},
        )

        return response
