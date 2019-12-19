import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker

from django.db.models.signals import post_save

from astrosat.tests.utils import optional_declaration

from astrosat_users.tests.factories import (
    UserFactory as AstrosatUserFactory,
    UserRoleFactory,
    UserPermissionFactory,
)

from orbis.models import OrbisUserProfile, DataScope


class OrbisUserProfileFactory(factory.DjangoModelFactory):
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


class DataScopeFactory(factory.DjangoModelFactory):
    class Meta:
        model = DataScope

    is_active = True

    authority = FactoryFaker("word")
    namespace = FactoryFaker("word")
    name = FactoryFaker("word")
    version = FactoryFaker("date", pattern="%Y-%m-%d")

    # roles = models.ManyToManyField(UserRole, related_name="data_access")
    # owners = models.ManyToManyField(User, related_name="data_access")
