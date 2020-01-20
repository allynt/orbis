from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "maps"

    def ready(self):

        # register any signals...
        try:
            import maps.signals  # noqa F401
        except ImportError:
            pass
