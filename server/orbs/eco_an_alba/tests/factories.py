import json

import factory
from factory.faker import (
    Faker as FactoryFaker,
)

from datetime import timedelta

from astrosat.tests.providers import GeometryProvider
from astrosat.tests.utils import optional_declaration

from astrosat_users.tests.factories import UserFactory

from orbs.eco_an_alba.models import Proposal

FactoryFaker.add_provider(GeometryProvider)

REPORT = {
    "summary": [{
        "type": "Habitat", "impact": 3
    }, {
        "type": "Geomorphology", "impact": 1
    }],
    "areas": [{
        "title": "Title 1",
    }, {
        "title": "Title 2",
    }],
    "impacts": [{
        "name":
            "Breeding Birds",
        "impact": [{
            "name": "Habitat",
            "effect": "Loss",
        }, {
            "name": "Habitat",
            "effect": "Loss",
        }]
    }]
}


class ProposalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Proposal

    name = FactoryFaker("sentence", nb_words=3)

    description = optional_declaration(FactoryFaker("text"), chance=50)

    owner = factory.SubFactory(UserFactory)

    geometry = FactoryFaker("polygon")

    proposal_description = FactoryFaker("text")

    proposal_start_date = FactoryFaker("date_time_this_month", after_now=True)

    proposal_activities = [{
        "title": "Activity 1", "code": "activity1"
    }, {
        "title": "Activity 2", "code": "activity2"
    }]

    report_state = REPORT

    @factory.lazy_attribute
    def proposal_end_date(self):
        return self.proposal_start_date + timedelta(days=7)
