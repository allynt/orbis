from django.conf import settings
from django.core.checks import register, Error, Tags


@register(Tags.compatibility)
def check_settings(app_configs, **kwargs):
    """
    Makes sure that some required settings are set.
    """

    errors = []

    if settings.ENVIRONMENT != "ci":  # it's okay for these settings to be unset in CI

        if not settings.DATA_SOURCES_DIRECTORY_URL:
            errors.append(Error("DATA_SOURCES_DIRECTORY_URL must be set."))
        if not settings.DATA_TOKEN_SECRET:
            errors.append(Error("DATA_TOKEN_SECRET must be set."))

    return errors
