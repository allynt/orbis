import datetime
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker

from django.db.models.signals import post_save
from django.utils.text import slugify

from rest_framework.utils.encoders import JSONEncoder

from astrosat.tests.providers import GeometryProvider, PrettyLoremProvider
from astrosat.tests.utils import optional_declaration

from astrosat_users.tests.factories import (
    UserFactory as AstrosatUserFactory,
    CustomerFactory as AstrosatUserCustomerFactory,
    UserRoleFactory,
    UserPermissionFactory,
)

from orbis.models import (
    OrbisUserProfile,
    Orb,
    DataScope,
    Licence,
    LicencedCustomer,
    Access,
    Satellite,
    SatelliteTier,
    SatelliteVisualisation,
    SatelliteSearch,
    SatelliteResult,
)

json_encoder = JSONEncoder()

FactoryFaker.add_provider(GeometryProvider)
FactoryFaker.add_provider(PrettyLoremProvider)

#########
# users #
#########


class OrbisUserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrbisUserProfile

    onboarded = FactoryFaker("boolean")
    units = FactoryFaker(
        "random_element", elements=[x[0] for x in OrbisUserProfile.UnitChoices]
    )
    region = FactoryFaker(
        "random_element", elements=[x[0] for x in OrbisUserProfile.RegionChoices]
    )

    # "orbis_profile=None" means that if I create an OrbisUserProfile explicitly, another profile won't be created
    # (it disables the RelatedFactory below)
    user = factory.SubFactory("orbis.tests.factories.UserFactory", orbis_profile=None)


@factory.django.mute_signals(
    post_save
)  # prevent signals from trying to create a profile outside of this factory
class UserFactory(AstrosatUserFactory):
    @factory.post_generation
    def post(obj, *args, **kwargs):
        # all users generated w/in the ORBIS tests should be pre-verified
        # (testing verification is done in `django-astrosat-users`)
        obj.verify()

    # "user" means that if I create a UserFactory explicitly, another user won't be created
    # (it disables the SubFactory above)
    orbis_profile = factory.RelatedFactory(OrbisUserProfileFactory, "user")


#############
# customers #
#############

class CustomerFactory(AstrosatUserCustomerFactory):

    class Meta:
        model = LicencedCustomer


########
# orbs #
########


class OrbFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Orb

    is_active = True
    is_private = False
    is_core = False
    name = factory.LazyAttributeSequence(lambda o, n: f"orb-{n}")
    description = optional_declaration(FactoryFaker("text"), chance=50)


    @factory.post_generation
    def data_scopes(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for data_scope in extracted:
                self.data_scopes.add(data_scope)


class DataScopeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DataScope

    is_active = True

    authority = FactoryFaker("word")
    namespace = FactoryFaker("word")
    name = FactoryFaker("word")
    version = FactoryFaker("date", pattern="%Y-%m-%d")


class LicenceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Licence

    access = FactoryFaker("pyint", min_value=0, max_value=sum(Access))


##############
# satellites #
##############


class SatelliteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Satellite

    satellite_id = factory.LazyAttributeSequence(lambda o, n: f"{slugify(o.title)}-{n}")
    title = FactoryFaker("pretty_sentence", nb_words=3)
    description = optional_declaration(FactoryFaker("text"), chance=50)

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


class SatelliteTierFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SatelliteTier

    name = factory.LazyAttributeSequence(lambda o, n: f"tier-{n}")
    title = FactoryFaker("pretty_sentence", nb_words=3)
    description = optional_declaration(FactoryFaker("text"), chance=50)

    @factory.lazy_attribute
    def order(self):
        return SatelliteTier.objects.count() + 1


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

    name = factory.LazyAttributeSequence(lambda o, n: f"search-{n}")
    start_date = factory.LazyAttribute(
        lambda o: o.end_date - datetime.timedelta(days=7)
    )
    end_date = datetime.datetime.today()
    aoi = FactoryFaker("polygon")
    owner = factory.SubFactory(UserFactory)

    @factory.post_generation
    def satellites(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for satellite in extracted:
                self.satellites.add(satellite)

    @factory.post_generation
    def tiers(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for tier in extracted:
                self.tiers.add(tier)


class SatelliteResultFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SatelliteResult

    scene_id = factory.Sequence(lambda n: f"scene-{n}")
    satellite = factory.SubFactory(SatelliteFactory)
    tier = factory.SubFactory(SatelliteTierFactory)
    cloud_cover = FactoryFaker("pyfloat", min_value=0, max_value=100)
    footprint = FactoryFaker("polygon")

    @factory.lazy_attribute
    def metadata(self):
        # generates a random dictionary and encodes it as JSON
        properties_dict = FactoryFaker("pydict").generate()
        return json_encoder.encode(properties_dict)
