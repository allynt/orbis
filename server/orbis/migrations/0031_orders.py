# Generated by Django 3.1.2 on 2020-10-19 17:54

import astrosat_users.models.models_users
import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import orbis.models.models_orders
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        # ('astrosat_users', '0021_auto_20201015_1626'),
        ('orbis', '0030_orb_licence_cost'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('cost', models.FloatField(default=0, help_text='The cost at the time of purchase.')),
                ('order_form', models.FileField(blank=True, null=True, upload_to=orbis.models.models_orders.order_form_path)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='astrosat_users.customer')),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
            },
        ),
        migrations.CreateModel(
            name='OrderType',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128)),
                ('description', models.TextField(blank=True, null=True)),
                ('cost_modifier', models.FloatField(default=1.0, help_text='Amount to multiply order cost by.')),
            ],
            options={
                'verbose_name': 'Order Type',
                'verbose_name_plural': 'Orders: Types',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('subscription_period', models.DurationField(default=datetime.timedelta(365))),
                ('n_licences', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('cost', models.FloatField(default=0.0, help_text='The cost at the time of purchase. (The final amount may be modified by the order_type.)')),
                ('orb', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orbis.orb')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='orbis.order')),
            ],
            options={
                'verbose_name': 'Order Item',
                'verbose_name_plural': 'Orders: Items',
            },
        ),
        migrations.AddField(
            model_name='order',
            name='order_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to='orbis.ordertype'),
        ),
        migrations.AddField(
            model_name='order',
            name='user',
            field=models.ForeignKey(help_text='The User that created this Order.', on_delete=models.SET(astrosat_users.models.models_users.get_sentinel_user), related_name='orders', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='licence',
            name='order_item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='licences', to='orbis.orderitem'),
        ),
    ]