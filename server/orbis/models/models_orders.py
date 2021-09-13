from datetime import datetime, timedelta
from io import BytesIO
from PyPDF2 import PdfFileMerger
from xhtml2pdf import pisa
import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import ExpressionWrapper, F
from django.db.models import Sum
from django.template.loader import get_template
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext as _

from astrosat_users.models import Customer, CustomerUser, get_sentinel_user

from core.utils import html_to_pdf, html_to_pdf_link_callback

from orbis.models import Licence, Document
"""
This is basically implementing a shopping cart model.
It can probably be factored-out into its own reusable app.
"""

###########
# helpers #
###########


def order_report_path(instance, filename):
    return f"customers/{instance.customer}/orders/{filename}"


DURATION_FORMAT = "[DD] [HH:[MM:]]ss[.uuuuuu]"

########################
# managers & querysets #
########################


class OrderManager(models.Manager):
    def get_by_natural_key(self, uuid):
        instance = self.get(uuid=uuid)
        return instance


class OrderItemManager(models.Manager):
    pass


class OrderQuerySet(models.QuerySet):
    pass


class OrderItemQuerySet(models.QuerySet):
    def expired(self, date=None):
        """
        returns all items with an expiry date greater than or equal to date
        """
        if date is None:
            date = timezone.now()
        qs = self.annotate(
            expiration=ExpressionWrapper(
                F("created") + F("subscription_period"),
                output_field=models.DateTimeField()
            )
        )
        return qs.filter(expiration__lt=date)


##########
# models #
##########


class OrderType(models.Model):
    """
    This classifies the order as being part of a free trial, etc.
    In the future it may have a "coupon code".
    """
    class Meta:
        app_label = "orbis"
        verbose_name = "Order Type"
        verbose_name_plural = "Orders: Types"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    cost_modifier = models.FloatField(
        default=1.0, help_text=_("Amount to multiply order cost by.")
    )

    def __str__(self):
        return self.name


class Order(models.Model):
    class Meta:
        app_label = "orbis"
        verbose_name = "Order"
        verbose_name_plural = "Orders"

    objects = OrderManager.from_queryset(OrderQuerySet)()

    uuid = models.UUIDField(
        default=uuid.uuid4, editable=False
    )  # note that this is not the pk

    created = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.SET(get_sentinel_user),
        related_name="orders",
        help_text=_("The User that created this Order."),
    )

    customer = models.ForeignKey(
        Customer, related_name="orders", on_delete=models.CASCADE
    )

    order_type = models.ForeignKey(
        OrderType, null=True, on_delete=models.SET_NULL, related_name="orders"
    )
    cost = models.FloatField(
        default=0, help_text=_("The cost at the time of purchase.")
    )
    # TODO: status = PENDING|PURCHASED|ERROR|ETC
    report = models.FileField(
        upload_to=order_report_path, blank=True, null=True
    )

    @property
    def order_number(self):
        if self.uuid:
            return self.uuid.hex[:7]

    def __str__(self):
        return f"{self.customer}: {self.order_number}"

    def natural_key(self):
        return (self.uuid, )

    def save(self, *args, **kwargs):
        if not self.pk:
            terms_agreement = self.user.documents.terms().active().first()
            if terms_agreement:
                self.terms = terms_agreement.terms
        super().save(*args, **kwargs)

    def recalculate_cost(self):
        subtotal = self.items.aggregate(Sum("cost"))["cost__sum"]
        self.cost = subtotal * self.order_type.cost_modifier
        self.save()

    def generate_report(self, report_filename=None, force_save=False):
        """
        Generates a PDF file corresponding to the Order
        """
        if report_filename is None:
            report_filename = f"{slugify(str(self))}-report.pdf"

        report_template = get_template("orbis/order.html")
        report_html_content = report_template.render({"order": self})

        buffer = BytesIO()
        pisa_status = pisa.CreatePDF(
            report_html_content,
            dest=buffer,
            link_callback=html_to_pdf_link_callback,
        )
        if pisa_status.err:
            raise Exception(f"Error generating report: {pisa_status.err}")

        buffer.seek(0)

        report = ContentFile(buffer.read(), report_filename)
        self.report = report

        if force_save:
            self.save()


class OrderItem(models.Model):
    class Meta:
        app_label = "orbis"
        verbose_name = "Order Item"
        verbose_name_plural = "Orders: Items"

    objects = OrderItemManager.from_queryset(OrderItemQuerySet)()

    order = models.ForeignKey(
        Order,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name="items"
    )

    created = models.DateTimeField(auto_now_add=True)
    subscription_period = models.DurationField(default=timedelta(days=365))
    orb = models.ForeignKey(
        "orbis.Orb", blank=False, null=False, on_delete=models.CASCADE
    )
    n_licences = models.IntegerField(validators=[MinValueValidator(1)])
    # note that "licences" can be accessed via a reverse fk from Licence
    cost = models.FloatField(
        default=0.0,
        help_text=_(
            "The cost at the time of purchase. (The final amount may be modified by the order_type.)"
        ),
    )

    def __str__(self):
        return f"{self.order}: {self.orb}: {self.n_licences}"

    @property
    def is_expired(self):
        if self.expiration:
            return self.expiration < timezone.now()

    @property
    def expiration(self):
        if self.created and self.subscription_period:
            return self.created + self.subscription_period

    @expiration.setter
    def expiration(self, date):
        assert (
            self.created
        ), "Cannot assign an expiration date on an order w/out a creation date."
        subscription_period = date - self.created
        self.subscription_period = subscription_period
        # self.save()

    def clean(self):
        # extra validation to ensure that all licences belong to a single orb
        if self.licences.values("orb").distinct().count() != 1:
            raise ValidationError(
                "An OrderItem can only contain Licences for a single Orb"
            )

    def recalculate_cost(self):
        self.cost = self.n_licences * self.orb.licence_cost
        self.save()
