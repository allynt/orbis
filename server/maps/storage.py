from django.conf import settings
from django.core.files.storage import FileSystemStorage

from storages.backends.s3boto3 import S3Boto3Storage


class LocalStorage(FileSystemStorage):
    pass


class S3Storage(S3Boto3Storage):
    access_key = settings.AWS_ACCESS_KEY_ID
    secret_key = settings.AWS_SECRET_ACCESS_KEY
    bucket_name = settings.MEDIA_STORAGE_BUCKET
    location = ""
