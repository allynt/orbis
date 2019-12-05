"""
Django settings for orbis project.
"""

import environ
import importlib
import os

from django.utils.html import escape
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from astrosat.utils import DynamicSetting


env = environ.Env()

PROJECT_NAME = "orbis"
PROJECT_SLUG = slugify(PROJECT_NAME)
PROJECT_EMAIL = "{role}@astrosat.space"

ROOT_DIR = environ.Path(__file__) - 4
SERVER_DIR = ROOT_DIR.path("server")
CLIENT_DIR = ROOT_DIR.path("client")

# DEBUG and SECRET_KEY is overwritten in deployment.py, development.py, or ci.py as appropriate
DEBUG = False
SECRET_KEY = "shhh..."

WSGI_APPLICATION = "wsgi.application"

SITE_ID = 1

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
    # statics...
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    # gis...
    "django.contrib.gis",
    # admin...
    "django.contrib.admin",
    # cors...
    "corsheaders",
]

THIRD_PARTY_APPS = [
    # apis...
    "rest_framework",
    "rest_framework_gis",
    "drf_yasg",
    "django_filters",
    # users...,
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "rest_auth",
    "rest_auth.registration",
    # "rest_framework.authtoken",
    "knox",
    # healthchecks...
    "health_check",
    "health_check.db",
]

LOCAL_APPS = [
    "astrosat",  # (dependencies)
    "astrosat_users",  # (users)
    "core",  # (shared stuff)
    "orbis",  # (this app)
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

##############
# Middleware #
##############

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
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

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            # override some default templates...
            str(SERVER_DIR.path("core/templates")),
            # and override some default templates from an imported app (rest_framework, allauth, & rest_auth)...
            os.path.join(
                os.path.dirname(importlib.import_module("astrosat_users").__file__),
                "templates",
            ),
            # and find the "index.html" template in the client build......
            str(CLIENT_DIR.path("build")),
        ],
        "OPTIONS": {
            "debug": DEBUG,
            "loaders": [
                # first look at templates in DIRS, then look in the standard place for each INSTALLED_APP
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                # TODO: CAN I GET RID OF SOME OF THESE...
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
            ],
        },
    }
]

################
# Static files #
################

STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

STATIC_URL = "/static/"
STATIC_ROOT = str(SERVER_DIR("static"))

STATICFILES_DIRS = [
    # STATIC_ROOT,  # no need to explicitly specify STATIC_ROOT again
    str(CLIENT_DIR.path("build/static"))
]

WHITENOISE_ROOT = str(CLIENT_DIR("build"))
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

###############
# Media files #
###############

MEDIA_URL = "/media/"
MEDIA_ROOT = str(SERVER_DIR("media"))

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

ADMINS = [(PROJECT_NAME, PROJECT_EMAIL.format(role="noreply"))]
MANAGERS = ADMINS

ADMIN_SITE_HEADER = f"{PROJECT_NAME} administration console"
ADMIN_SITE_TITLE = f"{PROJECT_NAME} administration console"
ADMIN_INDEX_TITLE = f"Welcome to the {PROJECT_NAME} administration console"

#########
# Email #
#########

# email backend is set in environment-specific settings...

# development: "django.core.mail.backends.console.EmailBackend"
# deployment: "django.core.mail.backends.smtp.EmailBackend"
# ci: django.core.mail.backends.locmem.EmailBackend"

DEFAULT_FROM_EMAIL = f"{PROJECT_NAME} <{PROJECT_EMAIL.format(role='automated')}>"
SERVER_EMAIL = PROJECT_EMAIL.format(role=f"{PROJECT_NAME}-admin")
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
        "Token Authentication": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": escape("Enter 'Token <key>'"),
        }
    },
    "DOC_EXPANSION": "none",
    "OPERATIONS_SORTER": None,
    "TAGS_SORTER": "alpha",
    "DEFAULT_MODEL_RENDERING": "example",
}

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

ACCOUNT_FORMS = {
    # customize forms for astrosat_users
    "login": "astrosat_users.forms.LoginForm",
    "reset_password": "astrosat_users.forms.PasswordResetForm",
}

REST_AUTH_SERIALIZERS = {
    # customize serializers for astrosat_users
    "TOKEN_SERIALIZER": "astrosat_users.serializers.KnoxTokenSerializer",
    "LOGIN_SERIALIZER": "astrosat_users.serializers.LoginSerializer",
    "PASSWORD_CHANGE_SERIALIZER": "astrosat_users.serializers.PasswordChangeSerializer",
    "PASSWORD_RESET_SERIALIZER": "astrosat_users.serializers.PasswordResetSerializer",
    "PASSWORD_RESET_CONFIRM_SERIALIZER": "astrosat_users.serializers.PasswordResetConfirmSerializer",
}
REST_AUTH_REGISTER_SERIALIZERS = {
    # customize serializers for astrosat_users
    "REGISTER_SERIALIZER": "astrosat_users.serializers.RegisterSerializer"
}

ACCOUNT_CONFIRM_EMAIL_CLIENT_URL = "/account/confirm-email/{key}"
ACCOUNT_CONFIRM_PASSWORD_CLIENT_URL = "/password/reset/{key}/{uid}"

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

PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 255
PASSWORD_STRENGTH = 2

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {
        "NAME": "astrosat_users.utils.LengthPasswordValidator",
        "OPTIONS": {
            "min_length": PASSWORD_MIN_LENGTH,
            "max_length": PASSWORD_MAX_LENGTH,
        },
    },
    {
        "NAME": "astrosat_users.utils.StrengthPasswordValidator",
        "OPTIONS": {"strength": PASSWORD_STRENGTH,},
    },
]

############
# Security #
############

# SESSION_COOKIE_HTTPONLY = True
# CSRF_COOKIE_HTTPONLY = True
# SECURE_BROWSER_XSS_FILTER = True
# X_FRAME_OPTIONS = 'DENY'

####################
# 3rd party access #
####################

MAPBOX_TOKEN = env("DJANGO_MAPBOX_TOKEN", default="")
TRACKING_ID = env("DJANGO_TRACKING_ID", default="")

###########
# logging #
###########

# logging is configured in development.py & deployment.py

#############
# profiling #
#############

# profiling is added in development.py
