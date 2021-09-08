from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.db import models


@receiver(post_delete)
def delete_files_when_row_deleted_from_db(sender, *args, **kwargs):
    """
    Whenever any model is deleted, if it has a file field on it, then
    delete the associated file also.
    """
    for field in sender._meta.concrete_fields:
        if isinstance(field, models.FileField):
            instance = kwargs['instance']
            file_field = getattr(instance, field.name)
            delete_file_if_unused(sender, instance, field, file_field)


@receiver(pre_save)
def delete_files_when_file_changed(sender, *args, **kwargs):
    """
    Delete the file if something else gets uploaded in it's place.
    """
    instance = kwargs['instance']

    # Don't run on initial save
    if not instance.pk:
        return

    for field in sender._meta.concrete_fields:
        if isinstance(field, models.FileField):
            # It's got a file field, see if it has changed.
            try:
                instance_in_db = sender.objects.get(pk=instance.pk)
            except sender.DoesNotExist:
                # We are probably in a transaction and the pk is just
                # temporary, don't worry about deleting attachments, if
                # they aren't actually saved yet.
                return

            instance_in_db_file_field = getattr(instance_in_db, field.name)
            file_field = getattr(instance, field.name)

            if instance_in_db_file_field.name != file_field.name:
                delete_file_if_unused(
                    sender, instance, field, instance_in_db_file_field
                )


def delete_file_if_unused(model, instance, field, file_field):
    """
    Only delete the file if no other instances of the model are using it.
    """
    dynamic_field = {}
    dynamic_field[field.name] = file_field.name

    refs_exist = model.objects.filter(**dynamic_field).exclude(pk=instance.pk
                                                              ).exists()
    if not refs_exist:
        file_field.delete(False)
