import pytest

from faker import Faker

from django.core.files.uploadedfile import SimpleUploadedFile

fake = Faker()

@pytest.fixture
def thumbnail():
    """
    returns a fake image to use as a thumbnail
    """
    def _thumbnail(**kwargs):
        return SimpleUploadedFile(
            name=kwargs.pop("name", f"{fake.word()}.png"),
            content=kwargs.pop("content", b"I am a fake thumbnail"),
            content_type=kwargs.pop("content_type", "image/png"),
        )

    return _thumbnail
