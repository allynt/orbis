# Generated by Django 3.0.8 on 2020-07-17 11:58

from django.db import migrations


# NOTE: THIS DATA MIGRATION IS NO LONGER APPLIED B/C IT
# NOTE: INTERFERES W/ THE NEWER WAY THE "CORE" ORB IS HANDLED


# data migration to ensure that the core orb exists
# and that all existing customer_users have a licence for it


def create_core_orbs_and_scopes(apps, schema_editor):
    OrbModel = apps.get_model("orbis", "Orb")
    DataScopeModel = apps.get_model("orbis", "DataScope")

    core_orb, _ = OrbModel.objects.get_or_create(name="core")
    core_scope, _ = DataScopeModel.objects.get_or_create(
        authority="astrosat",
        namespace="core",
        name="*",
        version="*",
    )
    core_orb.data_scopes.add(core_scope)


def create_core_licences(apps, schema_editor):
    CustomerModel = apps.get_model("astrosat_users", "Customer")
    OrbModel = apps.get_model("orbis", "Orb")
    LicenceModel = apps.get_model("orbis", "Licence")

    core_orb = OrbModel.objects.get(name="core")

    for customer in CustomerModel.objects.all():
        for customer_user in customer.customer_users.all():
            LicenceModel.objects.get_or_create(
                orb=core_orb,
                customer=customer,
                customer_user=customer_user,
            )


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0023_auto_20200714_1546'),
    ]

    # NOTE: THIS BIT IS COMMENTED OUT
    operations = [
        # migrations.RunPython(
        #     create_core_orbs_and_scopes, reverse_code=migrations.RunPython.noop
        # ),
        # migrations.RunPython(
        #     create_core_licences, reverse_code=migrations.RunPython.noop
        # ),
    ]
