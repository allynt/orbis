from django.conf import settings
from django.core.checks import register, Error, Tags

APP_NAME = "tasks"

# other apps required by tasks
APP_DEPENDENCIES = [
    "django_celery_beat",
    "django_celery_results",
]


@register(Tags.compatibility)
def check_dependencies(app_configs, **kwargs):
    """
    Makes sure that all django app dependencies are met.
    (Standard python dependencies are handled in setup.py.)
    Called by `AppConfig.ready()`.
    """

    errors = []
    for i, dependency in enumerate(APP_DEPENDENCIES):
        if dependency not in settings.INSTALLED_APPS:
            errors.append(
                Error(
                    f"You are using {APP_NAME} which requires the {dependency} module.  Please install it and add it to INSTALLED_APPS.",
                    id=f"{APP_NAME}:E{i:03}",
                )
            )

    return errors
