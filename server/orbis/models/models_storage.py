from django.conf import settings
from django.db import models


class DataStorage(models.Model):
    class Meta:
        app_label = "orbis"
        verbose_name = "Data Storage"
        verbose_name_plural = "Data Storage"

    customer = models.ForeignKey(
        "astrosat_users.Customer",
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        help_text="The customer that 'owns' this data storage object."
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name="storage",
        help_text="The user that created this data storage object"
    )

    title = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        help_text="Title/Name of the data stored"
    )
    created = models.DateTimeField(
        auto_now_add=True, help_text="When the Data object was created"
    )
    size = models.FloatField(
        blank=False,
        null=False,
        default=0.0,
        help_text="Size of the data in MBs"
    )

    def __str__(self):
        return str(self.title)

    def __repr__(self):
        return f"DataStorage: title={self.title}, created={self.created}, size={self.size}"
