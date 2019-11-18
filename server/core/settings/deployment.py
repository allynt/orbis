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
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "/var/log/{}/django.log".format(PROJECT_SLUG),
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "standard",
        },
        "request_handler": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "/var/log/{}/django_request.log".format(PROJECT_SLUG),
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "standard",
        },
        "mail_admins_handler": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "formatter": "standard",
        },
    },
    "root": {"handlers": ["default"], "level": "INFO"},
    "loggers": {
        "django.request": {
            "handlers": ["request_handler", "mail_admins_handler"],
            "level": "INFO",
            "propagate": False,
        }
    },
}
