import os

from .base import *  # noqa
from .base import env

###########
# General #
###########

DEPLOYMENT_APP = env("DJANGO_APP")
DEPLOYMENT_INSTANCE = env("DJANGO_INSTANCE")
DEPLOYMENT_ENVIRONMENT = env("DJANGO_ENVIRONMENT")

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

# These two SMTP TLS settings are poorly named
# EMAIL_USE_TLS means to use a non-TLS connection but then upgrade it using STARTTLS, on port 587.
# EMAIL_USE_SSL mean to use TLS from the start i.e. implicit/wrapper TLS connection, on port 465.
# With AWS SES we use implicit/wrapper TLS on port 465
# See: https://docs.djangoproject.com/en/3.1/ref/settings/#email-use-tls
EMAIL_USE_TLS = False
EMAIL_USE_SSL = True

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
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        },
        "orbis_analytics": {}
    },
    "handlers": {
        "null": {
            "class": "logging.NullHandler"
        },
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
    "root": {
        "handlers": ["default"], "level": "INFO"
    },
    "loggers": {
        "django.request": {
            "handlers": ["request_handler", "mail_admins_handler"],
            "level": "INFO",
            "propagate": False,
        },
        "db": {
            "handlers": ["db", ],
            "level": "DEBUG",
        },
        # This metrics logger is seperate from the db logger because it mostly
        # just records counts of things already in the database... so there's
        # not much point storing it in the database again. Also it has the
        # potential to be a lot of data.
        "metrics": {
            "handlers": ["default"],
            "level": "INFO",
        },
    },
}
