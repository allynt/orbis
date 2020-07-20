from django.db.models.signals import post_save, pre_delete

from astrosat_users.models import CustomerUser
from orbis.models import Licence, Orb


# these signals automatically add/remove Licences for the "core" Orb
# as CustomerUsers are added/deleted from Customers


def post_save_customer_user_handler(sender, *args, **kwargs):
    """
    If a CustomerUser has just been created,
    then grant it the "core" Licence
    """
    created = kwargs.get("created", False)
    instance = kwargs.get("instance", None)
    if created and instance:
        Licence.objects.get_or_create(
            orb=Orb.get_core_orb(), customer=instance.customer, customer_user=instance
        )


post_save.connect(
    post_save_customer_user_handler,
    sender=CustomerUser,
    dispatch_uid="post_save_customer_user_handler",
)


def pre_delete_customer_user_handler(sender, *args, **kwargs):
    """
    If a CustomerUser is about to be deleted,
    then revoke the "core" Licence (from the Customer as well)
    """
    instance = kwargs.get("instance", None)
    if instance:
        core_licence = instance.licences.get(orb=Orb.get_core_orb())
        core_licence.delete()


pre_delete.connect(
    pre_delete_customer_user_handler,
    sender=CustomerUser,
    dispatch_uid="pre_delete_customer_user_handler",
)
