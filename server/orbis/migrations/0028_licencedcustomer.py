# Generated by Django 3.1 on 2020-09-02 15:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('astrosat_users', '0018_auto_20200813_1156'),
        ('orbis', '0027_auto_20200825_1240'),
    ]

    operations = [
        migrations.CreateModel(
            name='LicencedCustomer',
            fields=[
            ],
            options={
                'verbose_name': 'Customer',
                'verbose_name_plural': 'Customers',
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('astrosat_users.customer',),
        ),
    ]
