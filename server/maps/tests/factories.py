import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker
import random

from astrosat.tests.providers import GeometryProvider, PrettyLoremProvider
from astrosat.tests.utils import optional_declaration
from astrosat_users.tests.factories import UserFactory

from maps.models import Bookmark


FactoryFaker.add_provider(GeometryProvider)
FactoryFaker.add_provider(PrettyLoremProvider)


test_annotations = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Astrosat",
                "color": "grey",
                "size": "big"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-3.054177761077881, 55.94196627088323],
            },
        }
    ],
}


class BookmarkFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Bookmark

    owner = factory.SubFactory(UserFactory)

    title = FactoryFaker("pretty_sentence", nb_words=3)

    description = optional_declaration(FactoryFaker("text"), chance=50)

    center = FactoryFaker("point")

    zoom = FactoryFaker("pyfloat", min_value=0, max_value=10)

    feature_collection = test_annotations

    @factory.lazy_attribute
    def layers(self):
        return [
            f"astrosat/core/{FactoryFaker('word').generate({})}/{i}"
            for i in range(random.randint(1, 10))
        ]
