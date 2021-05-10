from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "tasks"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):

        # # register any checks...
        # try:
        #     import tasks.checks  # noqa
        # except ImportError:
        #     pass

        # # register any signals...
        # try:
        #     import tasks.signals  # noqa
        # except ImportError:
        #     pass

        # register any tasks...
        import tasks.celery
