# Generated by Django 3.1.7 on 2021-03-29 22:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orbis', '0033_privacydocument_termsdocument'),
    ]

    operations = [
        migrations.CreateModel(
            name='TermsDocumentAgreement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('terms', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='terms_agreements', to='orbis.termsdocument')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='terms_agreements', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='termsdocument',
            name='users',
            field=models.ManyToManyField(related_name='terms', through='orbis.TermsDocumentAgreement', to=settings.AUTH_USER_MODEL),
        ),
    ]
