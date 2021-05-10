from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "orbis"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):

        # register any signals...
        try:
            import orbis.signals  # noqa
        except ImportError:
            pass
