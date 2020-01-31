from .base import *  # noqa
from .base import env

###########
# General #
###########

DEBUG = True

SECRET_KEY = "ci_orbis_1nu1$t^(idp+qw++kazw3&)r$gdn1a$l=msbc1mda3lt*t*#yi"

ALLOWED_HOSTS = [
    # note that ALLOWED_HOSTS is set to "['*']" in "deployment.py"
    # since Nginx is handling host vulnerabilities
    "localhost",
    "0.0.0.0",
    "127.0.0.1",
]


###############
# Media files #
###############

MEDIA_URL = "/media/"
MEDIA_ROOT = str(SERVER_DIR("media"))

############
# Database #
############

# database values are hard-coded in the appropriate section of build.yml;
# a transient db is created at 127.0.0.1:5666

#########
# Email #
#########

EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
EMAIL_HOST = "localhost"
EMAIL_PORT = 1025
