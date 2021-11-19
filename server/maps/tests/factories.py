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

TEST_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

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

    # geometry = FactoryFaker("point")

    thumbnail = SimpleUploadedFile(
        name="test_thumbnail.png",
        content=open(os.path.join(TEST_DATA_DIR, "test_thumbnail.png"),
                     'rb').read(),
        content_type='image/png'
    )

    geometry = FactoryFaker("point")

    # TODO: HOW TO RETURN FAKER VALUE
    # @factory.lazy_attribute
    # def geometry(self):
    #     # randomly select a point/ploygon/etc
    #     geometry_type = random.choice([
    #         "line_string",
    #         "multi_polygon",
    #         "point",
    #         "polygon",
    #     ])

    #     import pdb
    #     pdb.set_trace()
    #     return FactoryFaker(geometry_type).generate()
