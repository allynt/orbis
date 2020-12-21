import json
import logging

from rest_framework.utils import encoders

from astrosat_users.serializers import UserSerializerLite
from astrosat_users.views import LoginView as AstrosatUsersLoginView

db_logger = logging.getLogger("db")


class LoginView(AstrosatUsersLoginView):
    def get_success_response(self):

        response = super().get_success_response()

        # log this event in the db...
        user_data = UserSerializerLite(instance=self.user).data
        db_logger.info(
            json.dumps(user_data, cls=encoders.JSONEncoder),
            extra={"tags": ["USER_LOGIN"]},
        )

        return response
