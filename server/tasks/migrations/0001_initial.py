# Generated by Django 3.1.7 on 2021-03-25 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TaskSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enable_celery', models.BooleanField(default=True, help_text='Enable the task management system.')),
            ],
            options={
                'verbose_name': 'Task Settings',
                'verbose_name_plural': 'Task Settings',
            },
        ),
    ]
