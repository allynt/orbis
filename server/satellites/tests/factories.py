import datetime
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker when defining factory fields
from faker import Faker

from django.utils.text import slugify

from rest_framework.utils.encoders import JSONEncoder

from astrosat.tests.providers import GeometryProvider, PrettyLoremProvider
from astrosat.tests.utils import optional_declaration

from orbis.tests.factories import UserFactory

from satellites.models import (
    Satellite,
    SatelliteVisualisation,
    SatelliteSearch,
    SatelliteResult,
    SatelliteDataSource,
)

json_encoder = JSONEncoder()

fake = Faker()

FactoryFaker.add_provider(GeometryProvider)
FactoryFaker.add_provider(PrettyLoremProvider)


class SatelliteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Satellite

    satellite_id = factory.LazyAttributeSequence(
        lambda o, n: f"{slugify(o.title)}-{n}"
    )
    title = FactoryFaker("pretty_sentence", nb_words=3)
    description = optional_declaration(FactoryFaker("text"), chance=50)

    adapter_name = "mock-adapter"

    @factory.lazy_attribute
    def order(self):
        return Satellite.objects.count() + 1

    @factory.post_generation
    def visualisations(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for visualisation in extracted:
                self.visualisations.add(visualisation)


class SatelliteVisualisationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SatelliteVisualisation

    visualisation_id = factory.LazyAttributeSequence(
        lambda o, n: f"{slugify(o.title)}-{n}"
    )
    title = FactoryFaker("pretty_sentence", nb_words=3)
    description = optional_declaration(FactoryFaker("text"), chance=50)

    # thumbnail

    @factory.lazy_attribute
    def order(self):
        return Satellite.objects.count() + 1


class SatelliteSearchFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SatelliteSearch

    start_date = factory.LazyAttribute(
        lambda o: o.end_date - datetime.timedelta(days=7)
    )
    end_date = datetime.datetime.today()
    aoi = FactoryFaker("polygon")

    @factory.post_generation
    def satellites(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for satellite in extracted:
                self.satellites.add(satellite)


class SatelliteResultFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SatelliteResult

    scene_id = factory.Sequence(lambda n: f"scene-{n}")
    satellite = factory.SubFactory(SatelliteFactory)
    cloud_cover = FactoryFaker("pyfloat", min_value=0, max_value=100)
    footprint = FactoryFaker("polygon")

    @factory.lazy_attribute
    def metadata(self):
        # generates a random dictionary and encodes it as JSON
        properties_dict = fake.pydict()
        return json_encoder.encode(properties_dict)


class SatelliteDataSourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SatelliteDataSource

    name = factory.Sequence(lambda n: f"data-source-{n}")
    description = optional_declaration(
        FactoryFaker("text"), chance=50, default=""
    )

    satellite_id = factory.Sequence(lambda n: f"satellite-{n}")
    scene_id = factory.Sequence(lambda n: f"scene-{n}")
    visualisation_id = factory.Sequence(lambda n: f"visualisation-{n}")

    @factory.lazy_attribute
    def orbs(self):
        return [{"name": "My Data"}]

    @factory.lazy_attribute
    def categories(self):
        return {"name": "Satellite Images"}

    @factory.lazy_attribute
    def type(self):
        return SatelliteDataSource.TypeChoices.RASTER
