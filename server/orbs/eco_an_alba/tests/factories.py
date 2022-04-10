import json
import factory
from factory.faker import (Faker as FactoryFaker,)

from faker import Faker

from datetime import date, datetime, timedelta

from astrosat.tests.utils import optional_declaration

from astrosat_users.tests.factories import UserFactory

from orbs.eco_an_alba.models import Proposal

fake = Faker()

today = date.today()
tomorrow = date.today() + timedelta(days=1)
midnight_today = datetime.combine(today, datetime.min.time())
midnight_tomorrow = datetime.combine(tomorrow, datetime.min.time())

report_state = {
    "summary": [
        {
            "type": "Habitat",
            "impact": 3
        },
        {
            "type": "Geomorphology",
            "impact": 1
        }
    ],
    "areas": [
        {
            "title": "Title 1",
        },
        {
            "title": "Title 2",
        }
    ],
    "impacts": [
        {
            "name": "Breeding Birds",
            "impact": [
                {
                    "name": "Habitat",
                    "effect": "Loss",
                },
                {
                    "name": "Habitat",
                    "effect": "Loss",
                }
            ]
        }
    ]
}

class ProposalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Proposal

    created = midnight_today
    modified = midnight_today

    name = FactoryFaker("pretty_sentence", nb_words=3)

    description = optional_declaration(FactoryFaker("text"), chance=50)

    owner = factory.SubFactory(UserFactory)

    proposal_description = FactoryFaker("text")

    proposal_start_date = midnight_today
    proposal_end_date = midnight_tomorrow

    proposal_activities = ["Activity 1", "Activity 2"]

    report_state = json.dumps(report_state)
