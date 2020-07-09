# Generated by Django 2.2 on 2020-01-03 10:16

"""
Data Migration for ensuring ORBIS's default DataScope exist
"""

from django.db import migrations
from orbis.models.models_orbs import Access


def create_orbis_role_and_data_scope(apps, schema_editor):
    """
    Populate db w/ default OrbisRole & DataScope
    """

    RoleModel = apps.get_model("astrosat_users", "UserRole")
    DataScopeModel = apps.get_model("orbis", "DataScope")
    DataScopeRoleAccessModel = apps.get_model("orbis", "RoleAccess")

    # create default role...
    default_orbis_role, _ = RoleModel.objects.get_or_create(
        name="OrbisRole",
        description="Default role that all users of ORBIS are members of.",
    )

    # create default data scope w/ default role...
    default_orbis_data_scope, _ = DataScopeModel.objects.get_or_create(
        authority="astrosat", namespace="core",
    )
    default_orbis_data_scope.roles.add(default_orbis_role)

    # set access flag(s) for default data scope...
    default_orbis_data_scope_role_access = DataScopeRoleAccessModel.objects.get(
        role=default_orbis_role, data_scope=default_orbis_data_scope
    )
    default_orbis_data_scope_role_access.access = Access.READ  # read-only access by role
    default_orbis_data_scope_role_access.save()


def add_orbis_role_to_existing_users(apps, schema_editor):
    """
    Ensure that any pre-existing Users have the correct Role
    """

    UserModel = apps.get_model("astrosat_users", "User")
    RoleModel = apps.get_model("astrosat_users", "UserRole")

    default_orbis_role = RoleModel.objects.get(name="OrbisRole")

    for user in UserModel.objects.all():
        user.roles.add(default_orbis_role)


class Migration(migrations.Migration):

    dependencies = [
        ("orbis", "0005_auto_20191220_1608"),
    ]

    operations = [
        migrations.RunPython(
            create_orbis_role_and_data_scope, reverse_code=migrations.RunPython.noop
        ),
        migrations.RunPython(
            add_orbis_role_to_existing_users, reverse_code=migrations.RunPython.noop
        ),
    ]
