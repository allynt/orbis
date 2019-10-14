from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "orbis"

    def ready(self):

        # register any signals...
        try:
            import orbis.signals  # noqa F401
        except ImportError:
            pass
