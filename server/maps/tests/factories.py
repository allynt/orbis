import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker

from django.utils.text import slugify

from rest_framework.utils.encoders import JSONEncoder

from astrosat.tests.providers import GeometryProvider, PrettyLoremProvider
from astrosat.tests.utils import optional_declaration
from astrosat_users.tests.factories import UserFactory

from maps.models import Bookmark, Satellite, SatelliteScene, SatelliteVisualisation

json_encoder = JSONEncoder()

FactoryFaker.add_provider(GeometryProvider)
FactoryFaker.add_provider(PrettyLoremProvider)

test_geojson = {
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
        "coordinates": [
          -3.054177761077881,
          55.94196627088323
        ]
      }
    }
  ]
}

class BookmarkFactory(factory.DjangoModelFactory):
    class Meta:
        model = Bookmark

    title = FactoryFaker("pretty_sentence", nb_words=3)
    description = optional_declaration(FactoryFaker("text"), chance=50)
    center = FactoryFaker("point")
    zoom = FactoryFaker("pyfloat", min_value=0, max_value=10)
    feature_collection = test_geojson
    owner = factory.SubFactory(UserFactory)


class SatelliteFactory(factory.DjangoModelFactory):
    class Meta:
        model = Satellite

    satellite_id = factory.LazyAttribute(lambda o: slugify(o.title))
    title = FactoryFaker("pretty_sentence", nb_words=3)
    description = optional_declaration(FactoryFaker("text"), chance=50)



class SatelliteSceneFactory(factory.DjangoModelFactory):
    class Meta:
        model = SatelliteScene

    scene_id = FactoryFaker("word")
    satellite = factory.SubFactory(SatelliteFactory)
    # thumbnail

    @factory.lazy_attribute
    def properties(self):
      # generates a random dictionary and encodes it as JSON
      properties_dict = FactoryFaker("pydict").generate()
      return json_encoder.encode(properties_dict)


class SatelliteVisualisationFactory(factory.DjangoModelFactory):
    class Meta:
        model = SatelliteVisualisation

    visualisation_id = factory.LazyAttribute(lambda o: slugify(o.title))
    title = FactoryFaker("pretty_sentence", nb_words=3)
    description = optional_declaration(FactoryFaker("text"), chance=50)
    # thumbnail
