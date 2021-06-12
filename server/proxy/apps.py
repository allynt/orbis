from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "proxy"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):

        # register any signals...
        try:
            import proxy.signals  # noqa F401
        except ImportError:
            pass
