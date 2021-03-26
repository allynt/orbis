import logging
import json
from rest_framework.utils.encoders import JSONEncoder
from celery import shared_task

from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from orbis.models import LicencedCustomer as Customer

User = get_user_model()

metrics_logger = logging.getLogger("metrics")

@shared_task()
def orbis_debug_task(*args, **kwargs):
    print(f"Orbis - Task Args: {args!r} {kwargs!r}")


@shared_task()
def log_metrics():

    #
    # These are potentially heavy hitting database queries (full table scans).
    # If we get a lot of users or customers, we may need to optimise.
    #

    # One Document for Global Metrics
    global_metrics = {
        "type": "orbisGlobalMetrics",
        "orbisGlobalMetrics": {
            "totalUserCount": User.objects.count(),

            "totalCustomerCount": Customer.objects.count(),
            "activeCustomerCount": Customer.objects.filter(is_active=True).count(),
            "inactiveCustomerCount": Customer.objects.filter(is_active=False).count(),
        },
    }

    metrics_logger.info(
        json.dumps(global_metrics, cls=JSONEncoder),
    )

    # One Document per Customer for Customer Metrics
    customers_query = Customer.objects.filter(
        is_active=True,
    ).annotate(
        user_count=Count('users'),
    ).only(
        'id', 'name',
    )

    for customer in customers_query:
        customer_metrics = {
            "type": "orbisCustomerMetrics",
            "orbisCustomerMetrics": {
                "customerId": customer.id,
                "customerName": customer.name,
                "totalUserCount": customer.user_count,
            },
        }

        metrics_logger.info(
            json.dumps(customer_metrics, cls=JSONEncoder),
        )
