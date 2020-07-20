# Generated by Django 3.0.8 on 2020-07-20 21:05

from django.db import migrations

def create_user_role(apps, schema_editor):
    RoleModel = apps.get_model("astrosat_users", "UserRole")
    user_role, _ = RoleModel.objects.get_or_create(name="UserRole")


def add_user_role_to_existing_users(apps, schema_editor):
    UserModel = apps.get_model("astrosat_users", "User")
    RoleModel = apps.get_model("astrosat_users", "UserRole")

    user_role = RoleModel.objects.get(name="UserRole")

    for user in UserModel.objects.all():
        user.roles.add(user_role)


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0024_default_orbs'),
    ]

    operations = [
        migrations.RunPython(
            create_user_role, reverse_code=migrations.RunPython.noop
        ),
        migrations.RunPython(
            add_user_role_to_existing_users, reverse_code=migrations.RunPython.noop
        ),
    ]
