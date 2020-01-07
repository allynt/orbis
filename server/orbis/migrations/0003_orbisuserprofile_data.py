# Generated by Django 2.2 on 2019-12-10 15:16

from django.db import migrations


def create_profiles_for_existing_users(apps, schema_editor):
    """
    Ensure that any pre-existing Users have the correct Profile
    """

    UserModel = apps.get_model("astrosat_users", "User")
    ProfileModel = apps.get_model("orbis", "OrbisUserProfile")

    for user in UserModel.objects.all():
        ProfileModel.objects.get_or_create(user=user)


class Migration(migrations.Migration):

    dependencies = [
        ("astrosat_users", "0001_initial"),
        ('orbis', '0002_orbisuserprofile'),
    ]

    operations = [
        migrations.RunPython(
            create_profiles_for_existing_users, reverse_code=migrations.RunPython.noop
        )
    ]