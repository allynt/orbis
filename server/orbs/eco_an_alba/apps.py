from django.apps import AppConfig


class EcoAnAlbaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'orbs.eco_an_alba'

    def ready(self):
        # register any checks...
        try:
            import ecoanalba.checks  # noqa
        except ImportError:
            pass

        # register any signals...
        try:
            import ecoanalba.signals  # noqa
        except ImportError:
            pass
