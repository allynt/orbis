"""
Django settings for orbis project.
"""

import importlib
import json
import os
from urllib.parse import quote_plus

import environ

from django.utils.html import escape
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from astrosat.utils import DynamicSetting

env = environ.Env()

PROJECT_NAME = "orbis"
PROJECT_SLUG = slugify(PROJECT_NAME)
PROJECT_EMAIL = "{role}@" + env("DJANGO_EMAIL_DOMAIN", default="astrosat.net")

COMMIT_SHA = env("COMMIT_SHA", default="")

ROOT_DIR = environ.Path(__file__) - 4
SERVER_DIR = ROOT_DIR.path("server")

# DEBUG and SECRET_KEY is overwritten in deployment.py, development.py, or ci.py as appropriate
DEBUG = False
SECRET_KEY = "shhh..."

WSGI_APPLICATION = "wsgi.application"

SITE_ID = 1

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

ROOT_URLCONF = "core.urls"

APPEND_SLASH = True

############
# Database #
############

# database is overwritten in "ci.py"

DATABASES = {
    "default": {
        "ATOMIC_REQUESTS": True,
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": env("DJANGO_DB_NAME", default=""),
        "USER": env("DJANGO_DB_USER", default=""),
        "PASSWORD": env("DJANGO_DB_PASSWORD", default=""),
        "HOST": env("DJANGO_DB_HOST", default=""),
        "PORT": env("DJANGO_DB_PORT", default=""),
    }
}

########
# Apps #
########

DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.sites",
    "django.contrib.staticfiles",
    # gis...
    "django.contrib.gis",
    # admin...
    "django.contrib.admin",
    # cors...
    "corsheaders",
]  # yapf: disable

THIRD_PARTY_APPS = [
    # apis...
    "rest_framework",
    "rest_framework_gis",
    "drf_yasg2",
    "django_filters",
    # users...,
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "knox",
    # tasks...
    "django_celery_beat",
    "django_celery_results",
    # healthchecks...
    "health_check",
    "health_check.db",
]  # yapf: disable

LOCAL_APPS = [
    "astrosat",  # (dependencies)
    "astrosat_users",  # (users)
    "core",  # (shared stuff)
    "proxy",  # (proxy data)
    "satellites",  # (satellite data)
    "maps",  # (mapping tools)
    "tasks",  # (task management)
    "orbis",  # (this app)
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

###################
# external access #
###################

# some of these are defined in terraform as "app_secret" (defined per deployment)
# while others are defined in terraform as "app_aws_secret" (defined per environment)

TRACKING_ID = env("DJANGO_TRACKING_ID", default="")

AWS_ACCESS_KEY_ID = env("DJANGO_AWS_ACCESS_KEY_ID", default="")
AWS_SECRET_ACCESS_KEY = env("DJANGO_AWS_SECRET_ACCESS_KEY", default="")
AWS_DEFAULT_ACL = None

MAPBOX_TOKEN = env("DJANGO_MAPBOX_TOKEN", default="")

# (note that DJANGO_MAPBOX_STYLES is stringified JSON)
MAPBOX_STYLES = json.loads(env("DJANGO_MAPBOX_STYLES", default='[]'))

USER_TRACKING_INTERVAL = env("DJANGO_USER_TRACKING_INTERVAL", default=60000)

COPERNICUS_USERNAME = env("DJANGO_COPERNICUS_USERNAME", default="")
COPERNICUS_PASSWORD = env("DJANGO_COPERNICUS_PASSWORD", default="")

DATA_TOKEN_ALGORITHM = env("DJANGO_DATA_TOKEN_ALGORITHM", default="HS256")
DATA_SOURCES_DIRECTORY_URL = env(
    "DJANGO_DATA_SOURCES_DIRECTORY_URL",
    default="",
)
DATA_TOKEN_SECRET = env(
    "DJANGO_DATA_TOKEN_SECRET",
    default="",
)

DATA_INDEX_URL = env(
    "DJANGO_DATA_INDEX_URL",
    default="https://api.testing.ireland.data-index-service.astrosat.net/v1/"
)

# On-Line Scene Processor for satellite imagery
OLSP_URL = env("DJANGO_OLSP_URL", default="http://www.olsp.com")

# the time in minutes that a data_token is valid for
DATA_TOKEN_TIMEOUT = DynamicSetting(
    "orbis.OrbisSettings.data_token_timeout", 60
)

# the maximum aoi area that can be passed to a query
MAXIMUM_AOI_AREA = DynamicSetting(
    "satellites.SatelliteSettings.maximum_aoi_area", 500
)

##############
# Middleware #
##############

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

#############
# Templates #
#############

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [
        # override some default templates...
        str(SERVER_DIR.path("core/templates")),
        # and override some default templates from imported apps...
        os.path.join(
            os.path.dirname(importlib.import_module("astrosat_users").__file__),
            "templates",
        ),
    ],
    "OPTIONS": {
        "debug":
            DEBUG,
        "loaders": [
            # first look at templates in DIRS...
            "django.template.loaders.filesystem.Loader",
            # then look in the standard place for each INSTALLED_APP...
            "django.template.loaders.app_directories.Loader",
        ],
        "context_processors": [
            "django.template.context_processors.debug",
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
            "django.template.context_processors.i18n",
            "django.template.context_processors.media",
            "django.template.context_processors.static",
            "django.template.context_processors.tz",
        ],
    },
}]

###########
# caching #
###########

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "proxy_cache",  # name of db table
    },
}

################
# Static files #
################

STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

STATIC_URL = "/static/"
STATIC_ROOT = str(SERVER_DIR("static"))

###############
# Media files #
###############

MEDIA_STORAGE_BUCKET = env("DJANGO_MEDIA_BUCKET", default="")

# further configuration is done in development.py & deployment.py

########################
# Internationalisation #
########################

TIME_ZONE = "UTC"
LANGUAGE_CODE = "en-gb"
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [("en-us", _("American English")), ("en-gb", _("British English"))]

LOCALE_PATHS = [str(SERVER_DIR("core/locale"))]

#########
# Admin #
#########

ADMIN_URL = "admin/"

ADMINS = [(PROJECT_NAME, PROJECT_EMAIL.format(role="techdev"))]
MANAGERS = ADMINS

ADMIN_SITE_HEADER = f"{PROJECT_NAME} administration console"
ADMIN_SITE_TITLE = f"{PROJECT_NAME} administration console"
ADMIN_INDEX_TITLE = f"Welcome to the {PROJECT_NAME} administration console"

#########
# Tasks #
#########

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_SERIALIZER = "json"
CELERY_TASK_SOFT_TIME_LIMIT = 60 * 5  # 5 minutes until SoftTimeLimitExceeded
CELERY_TASK_TIME_LIMIT = 60 * 25  # 25 minutes until worker is killed & replace

CELERY_BROKER_URL = "{protocol}://:{password}@{host}:{port}/{dbnum}".format(
    protocol=quote_plus(env("DJANGO_CELERY_BROKER_PROTOCOL", default="redis")),
    host=quote_plus(env("DJANGO_CELERY_BROKER_HOST", default="localhost")),
    port=quote_plus(env("DJANGO_CELERY_BROKER_PORT", default="6379")),
    password=quote_plus(env("DJANGO_CELERY_BROKER_REDIS_PASSWORD", default="")),
    dbnum=quote_plus(env("DJANGO_CELERY_BROKER_REDIS_DB", default="0")),
)

CELERY_RESULT_BACKEND = "django-db"  # django-celery-results
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers.DatabaseScheduler"  # django-celery-beat

#########
# Email #
#########

# email backend is set in environment-specific settings...

# development: "django.core.mail.backends.console.EmailBackend"
# deployment: "django.core.mail.backends.smtp.EmailBackend"
# ci: django.core.mail.backends.locmem.EmailBackend"

DEFAULT_FROM_EMAIL = f"{PROJECT_NAME} <{PROJECT_EMAIL.format(role='noreply')}>"
SERVER_EMAIL = PROJECT_EMAIL.format(role="noreply")
EMAIL_TIMEOUT = 60

#######
# API #
#######

REST_FRAMEWORK = {
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.NamespaceVersioning",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # "rest_framework.authentication.BasicAuthentication",  # insecure
        # "rest_framework.authentication.SessionAuthentication",  # CSRF
        # "rest_framework.authentication.TokenAuthentication",  # tokens
        # "rest_framework_simplejwt.authentication.JWTTokenUserAuthentication",  # tokens w/out a user
        "knox.auth.TokenAuthentication",  # better tokens
    ],
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
    "COERCE_DECIMAL_TO_STRING": False,
    # "DEFAULT_FILTER_BACKENDS": (
    #     "django_filters.rest_framework.DjangoFilterBackend",
    # ),
}

SWAGGER_SETTINGS = {
    "SECURITY_DEFINITIONS": {
        "Token": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": escape("Enter 'Token <token>'"),
        },
        "Basic": {
            "type": "basic"
        },
    },
    "DOC_EXPANSION": "none",
    "OPERATIONS_SORTER": None,
    "TAGS_SORTER": "alpha",
    "DEFAULT_MODEL_RENDERING": "example",
}

########
# CORS #
########

CLIENT_HOST = env("DJANGO_CLIENT_HOST", default="")
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGIN_REGEXES = [rf"^{CLIENT_HOST}$"]

if DEBUG:
    CORS_ALLOWED_ORIGIN_REGEXES += [r"^https?://localhost(:\d+)?$"]

# (only using cors on the API)
CORS_URLS_REGEX = r"^/api/.*$"

##########################
# Authentication & Users #
##########################

LOGIN_URL = "account_login"
LOGOUT_URL = "account_logout"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

AUTH_USER_MODEL = "astrosat_users.User"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

ACCOUNT_ADAPTER = "astrosat_users.adapters.AccountAdapter"
SOCIALACCOUNT_ADAPTER = "astrosat_users.adapters.SocialAccountAdapter"

ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_LOGIN_ATTEMPTS_LIMIT = 5
ACCOUNT_LOGOUT_ON_GET = False
ACCOUNT_USERNAME_BLACKLIST = ["admin", "sentinel"]

REST_AUTH_TOKEN_MODEL = "knox.models.AuthToken"
REST_AUTH_TOKEN_CREATOR = "astrosat_users.utils.create_knox_token"

# custom forms...
ACCOUNT_FORMS = {
    # "add_email": "allauth.account.forms.AddEmailForm",
    "change_password": "astrosat_users.forms.PasswordChangeForm",
    # "disconnect": "allauth.socialaccount.forms.DisconnectForm",
    "login": "astrosat_users.forms.LoginForm",
    "reset_password": "astrosat_users.forms.PasswordResetForm",
    # "reset_password_from_key": "allauth.account.forms.ResetPasswordKeyForm",
    "set_password": "astrosat_users.forms.PasswordSetForm",
    "signup": "astrosat_users.forms.RegistrationForm",
}

# custom serializers...
REST_AUTH_SERIALIZERS = {
    # customize serializers for astrosat_users
    "TOKEN_SERIALIZER":
        "astrosat_users.serializers.KnoxTokenSerializer",
    "LOGIN_SERIALIZER":
        # "astrosat_users.serializers.LoginSerializer",
        "orbis.serializers.LoginSerializer",
    "PASSWORD_CHANGE_SERIALIZER":
        "astrosat_users.serializers.PasswordChangeSerializer",
    "PASSWORD_RESET_SERIALIZER":
        "astrosat_users.serializers.PasswordResetSerializer",
    "PASSWORD_RESET_CONFIRM_SERIALIZER":
        "astrosat_users.serializers.PasswordResetConfirmSerializer",
}

# more custom serializers...
REST_AUTH_REGISTER_SERIALIZERS = {
    # customize serializers for orbis
    "REGISTER_SERIALIZER": "orbis.serializers.RegisterSerializer"
}

ACCOUNT_LOGIN_CLIENT_URL = "/accounts/login"
ACCOUNT_CONFIRM_EMAIL_CLIENT_URL = "/accounts/confirm-email/{key}"
ACCOUNT_CONFIRM_PASSWORD_CLIENT_URL = "/accounts/password/reset/{key}/{uid}"

# the proxy view uses authentication from djangorestframework-simplejwt
# so a bit of additional configuration is necessary...
SIMPLE_JWT = {
    "ALGORITHM": DATA_TOKEN_ALGORITHM,
    "SIGNING_KEY": DATA_TOKEN_SECRET,
    "USER_ID_CLAIM": "sub",
    "AUTH_TOKEN_CLASSES": ["proxy.permissions.DataAccessToken"],
}

#############
# passwords #
#############

PASSWORD_HASHERS = [
    # the 1st item in this list is the default hasher
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.BCryptPasswordHasher",
]

PASSWORD_RESET_TIMEOUT = 604800  # (7 days in seconds); default is 259200 (3 days in seconds)

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
            "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {
        "NAME": "astrosat_users.validators.LengthPasswordValidator"
    },
    {
        "NAME": "astrosat_users.validators.StrengthPasswordValidator"
    },
]

############
# Security #
############

# SESSION_COOKIE_HTTPONLY = True
# CSRF_COOKIE_HTTPONLY = True
# SECURE_BROWSER_XSS_FILTER = True
# X_FRAME_OPTIONS = 'DENY'

###########
# logging #
###########

# logging is configured in development.py & deployment.py

#############
# profiling #
#############

# profiling is added in development.py
