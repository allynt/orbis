# Generated by Django 2.2 on 2019-12-20 16:08

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import orbis.models.models_orbs


class Migration(migrations.Migration):

    dependencies = [
        ('astrosat_users', '0004_auto_20191202_1100'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orbis', '0004_auto_20191210_1625'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataScope',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('authority', models.CharField(default='*', max_length=128)),
                ('namespace', models.CharField(default='*', max_length=128)),
                ('name', models.CharField(default='*', max_length=128)),
                ('version', models.CharField(default='*', max_length=128)),
            ],
            options={
                'verbose_name': 'Orbis Data Scope',
                'verbose_name_plural': 'Orbis Data Scopes',
            },
        ),
        migrations.CreateModel(
            name='RoleAccess',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('access', models.PositiveIntegerField(default=orbis.models.models_orbs.Access(1), validators=[django.core.validators.MaxValueValidator(7)])),
                ('data_scope', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orbis.DataScope')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='astrosat_users.UserRole')),
            ],
            options={
                'verbose_name': 'Role Access',
            },
        ),
        migrations.CreateModel(
            name='OwnerAccess',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('access', models.PositiveIntegerField(default=orbis.models.models_orbs.Access(1), validators=[django.core.validators.MaxValueValidator(7)])),
                ('data_scope', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orbis.DataScope')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Owner Access',
            },
        ),
        migrations.AddField(
            model_name='datascope',
            name='owners',
            field=models.ManyToManyField(related_name='data_scopes', through='orbis.OwnerAccess', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='datascope',
            name='roles',
            field=models.ManyToManyField(related_name='data_scopes', through='orbis.RoleAccess', to='astrosat_users.UserRole'),
        ),
        migrations.AddConstraint(
            model_name='datascope',
            constraint=models.UniqueConstraint(fields=('authority', 'namespace', 'name', 'version'), name='unique_source_id'),
        ),
    ]
