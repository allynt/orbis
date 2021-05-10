from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "maps"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):

        # register any signals...
        try:
            import maps.signals  # noqa F401
        except ImportError:
            pass
