from celery import shared_task

from django.contrib.auth import get_user_model

User = get_user_model()

@shared_task()
def orbis_debug_task(*args, **kwargs):
    print(f"Orbis - Task Args: {args!r} {kwargs!r}")
