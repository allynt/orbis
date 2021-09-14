import datetime
import factory
from factory.faker import (
    Faker as FactoryFaker,
)  # note I use FactoryBoy's wrapper of Faker when defining factory fields
from faker import Faker

from django.core.files.uploadedfile import SimpleUploadedFile
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
    OrbisUserFeedbackRecord,
    Document,
    DocumentAgreement,
    DocumentType,
    PrivacyDocument,
    TermsDocument,
    UserGuideDocument,
    Orb,
    OrbImage,
    DataScope,
    Licence,
    LicencedCustomer,
    Access,
    OrderType,
    Order,
    OrderItem,
)

json_encoder = JSONEncoder()

fake = Faker()

FactoryFaker.add_provider(GeometryProvider)
FactoryFaker.add_provider(PrettyLoremProvider)

#########
# users #
#########


class OrbisUserFeedbackRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrbisUserFeedbackRecord

    provided_feedback = FactoryFaker("boolean")

    @factory.lazy_attribute
    def source_ids(self):
        return [
            f"{fake.word()}/{fake.word()}/{fake.word()}/{fake.date(pattern='%Y-%m-%d')}"
            for _ in range(4)
        ]


class OrbisUserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrbisUserProfile

    onboarded = FactoryFaker("boolean")
    units = FactoryFaker(
        "random_element", elements=[x[0] for x in OrbisUserProfile.UnitChoices]
    )
    region = FactoryFaker(
        "random_element",
        elements=[x[0] for x in OrbisUserProfile.RegionChoices]
    )

    # "orbis_profile=None" means that if I create an OrbisUserProfile explicitly, another profile won't be created
    # (it disables the RelatedFactory below)
    user = factory.SubFactory(
        "orbis.tests.factories.UserFactory", orbis_profile=None
    )


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


#############
# documents #
#############


class DocumentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Document

    name = factory.LazyAttributeSequence(lambda o, n: f"document-{n}")
    version = optional_declaration(FactoryFaker("slug"), chance=50)
    type = optional_declaration(
        FactoryFaker("random_element", elements=[x[0] for x in DocumentType]),
        chance=50
    )
    is_active = None

    @factory.lazy_attribute
    def file(self):
        return SimpleUploadedFile(
            name=f"{self.name}.pdf",
            content=b"I am a fake document",
            content_type="application/pdf",
        )


########
# orbs #
########


class OrbImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrbImage

    @factory.lazy_attribute_sequence
    def file(self, n):

        return SimpleUploadedFile(
            name=f"orb_image_{n+1}.png",
            content=b"I am a fake image",
            content_type="image/png",
        )


class OrbFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Orb

    description = optional_declaration(FactoryFaker("text"), chance=50)
    short_description = optional_declaration(FactoryFaker("text"), chance=50)
    is_active = True
    is_default = False
    is_hidden = False
    licence_cost = FactoryFaker("pyfloat", min_value=1.0, max_value=10.0)
    name = factory.LazyAttributeSequence(lambda o, n: f"orb-{n}")

    @factory.post_generation
    def data_scopes(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for data_scope in extracted:
                self.data_scopes.add(data_scope)

    @factory.post_generation
    def images(self, create, extracted, **kwargs):
        """
        when called w/ OrbFactory(images=2), generates an Orb w/ 2 OrbImages
        """
        if not create:
            return

        if extracted:
            for _ in range(extracted):
                OrbImageFactory(orb=self)
        else:
            # _could_ create some default images here,
            # but I don't actually care.
            pass

    @factory.lazy_attribute
    def logo(self):
        return SimpleUploadedFile(
            name=f"{self.name}_logo.svg",
            content=b'<svg><circle r="50" cx="50" cy="50" fill="red"/></svg>',
            content_type="image/svg+xml",
        )


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


##########
# orders #
##########


class OrderTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrderType

    name = factory.LazyAttributeSequence(lambda o, n: f"order-type-{n}")
    description = optional_declaration(FactoryFaker("text"), chance=50)
    cost_modifier = FactoryFaker("pyfloat", min_value=0, max_value=1)


class OrderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Order

    user = factory.SubFactory(UserFactory)
    customer = factory.SubFactory(CustomerFactory)
    order_type = factory.SubFactory(OrderTypeFactory)


class OrderItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrderItem

    order = factory.SubFactory(OrderFactory)
    orb = factory.SubFactory(OrbFactory)
    n_licences = FactoryFaker("pyint", min_value=1, max_value=10)
    cost = FactoryFaker("pyfloat", min_value=0.0, max_value=100.0)

    @factory.lazy_attribute
    def subscription_period(self):
        dt1 = fake.date_time()
        dt2 = fake.date_time_between(dt1)
        return dt2 - dt1  # returns a datetime.timedelta

    # note that "licences" can be accessed via a reverse fk from Licence
    @factory.post_generation
    def licences(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for licence in extracted:
                self.licences.add(licence)
        else:
            for _ in range(self.n_licences):
                licence = LicenceFactory(
                    orb=self.orb, customer=self.order.customer
                )
                self.licences.add(licence)
