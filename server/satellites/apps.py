from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "satellites"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):

        # register any signals...
        try:
            import satellites.signals  # noqa F401
        except ImportError:
            pass
