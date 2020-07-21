from django.contrib.auth import get_user_model
from django.db.models.signals import post_save

from astrosat_users.models import UserRole
from orbis.models import OrbisUserProfile


def post_save_user_handler(sender, *args, **kwargs):
    """
    If a User has just been created,
    then the corresponding ORBIS Profile must also be created,
    and the UserRole must also be added.
    """
    created = kwargs.get("created", False)
    instance = kwargs.get("instance", None)
    if created and instance:
        OrbisUserProfile.objects.create(user=instance)
        user_role, _ = UserRole.objects.get_or_create(name="UserRole")
        instance.roles.add(user_role)


post_save.connect(
    post_save_user_handler,
    sender=get_user_model(),
    dispatch_uid="post_save_user_handler",
)
