import os

from .base import *  # noqa
from .base import env

###########
# General #
###########

SECRET_KEY = env("DJANGO_SECRET_KEY")

DEBUG = env("DJANGO_DEBUG", default="false").lower() == "true"

# note that we can use a wildcard, b/c Nginx is handling host vulnerabilities
ALLOWED_HOSTS = ["*"]

###############
# Media files #
###############

DEFAULT_FILE_STORAGE = 'maps.storage.S3Storage'
MEDIA_URL = f"https://{MEDIA_STORAGE_BUCKET}/"

#########
# Email #
#########

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_TLS = True

EMAIL_HOST = env("DJANGO_EMAIL_HOST")
EMAIL_PORT = env("DJANGO_EMAIL_PORT")
EMAIL_HOST_USER = env("DJANGO_EMAIL_USER")
EMAIL_HOST_PASSWORD = env("DJANGO_EMAIL_PASSWORD")

###########
# Logging #
###########

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {"format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"}
    },
    "handlers": {
        "null": {"class": "logging.NullHandler"},
        "default": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
        "request_handler": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
        "mail_admins_handler": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "formatter": "standard",
        },
        "db": {
            "class": "astrosat.utils.DatabaseLogHandler",
        },
    },
    "root": {"handlers": ["default"], "level": "INFO"},
    "loggers": {
        "django.request": {
            "handlers": ["request_handler", "mail_admins_handler"],
            "level": "INFO",
            "propagate": False,
        },
        "db": {
            "handlers": ["db"],
            "level": "DEBUG"
        },
    },
}
