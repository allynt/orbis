import os
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker when defining factory fields
from faker import Faker
import random

from django.core.files.uploadedfile import SimpleUploadedFile

from astrosat.tests.providers import GeometryProvider, PrettyLoremProvider
from astrosat.tests.utils import optional_declaration
from astrosat_users.tests.factories import UserFactory

from maps.models import Aoi, Bookmark

fake = Faker()

FactoryFaker.add_provider(GeometryProvider)
FactoryFaker.add_provider(PrettyLoremProvider)

test_annotations = {
    "type":
        "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "name": "Astrosat", "color": "grey", "size": "big"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-3.054177761077881, 55.94196627088323],
        },
    }],
}


class BookmarkFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Bookmark

    owner = factory.SubFactory(UserFactory)

    title = FactoryFaker("pretty_sentence", nb_words=3)

    description = optional_declaration(FactoryFaker("text"), chance=50)

    center = FactoryFaker("point")

    zoom = FactoryFaker("pyfloat", min_value=0, max_value=10)

    drawn_feature_collection = test_annotations

    @factory.lazy_attribute
    def layers(self):
        return [
            f"astrosat/core/{fake.word()}/{i}"
            for i in range(random.randint(1, 10))
        ]


class AoiFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Aoi

    name = FactoryFaker("pretty_sentence", nb_words=3)

    description = optional_declaration(FactoryFaker("text"), chance=50)

    owner = factory.SubFactory(UserFactory)

    geometry = FactoryFaker("point")

    @factory.lazy_attribute
    def thumbnail(self):
        return SimpleUploadedFile(
            name=f"{self.name}",
            content=b"I am a fake image",  # Fake binary content.
            content_type="image/png"
        )
