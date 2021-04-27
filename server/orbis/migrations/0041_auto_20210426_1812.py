# Generated by Django 3.2 on 2021-04-26 18:12

from django.db import migrations, models
import orbis.models.models_documents


class Migration(migrations.Migration):

    dependencies = [
        ('orbis', '0040_auto_20210422_1559'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserGuideDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.SlugField()),
                ('version', models.SlugField(blank=True, null=True)),
                ('is_active', models.BooleanField(null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('file', models.FileField(upload_to=orbis.models.models_documents.user_guide_media_path, validators=[orbis.models.models_documents.validate_pdf_extension])),
            ],
            options={
                'verbose_name': 'User Guide Document',
                'verbose_name_plural': 'Documents: User Guide',
            },
        ),
        migrations.AddField(
            model_name='privacydocument',
            name='name',
            field=models.SlugField(default='current'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='termsdocument',
            name='name',
            field=models.SlugField(default='current'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='privacydocument',
            name='is_active',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='privacydocument',
            name='version',
            field=models.SlugField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='termsdocument',
            name='is_active',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='termsdocument',
            name='version',
            field=models.SlugField(blank=True, null=True),
        ),
        migrations.AddConstraint(
            model_name='privacydocument',
            constraint=models.UniqueConstraint(fields=('name', 'version'), name='unique_privacy_name_version'),
        ),
        migrations.AddConstraint(
            model_name='privacydocument',
            constraint=models.UniqueConstraint(fields=('name', 'is_active'), name='unique_privacy_name_active'),
        ),
        migrations.AddConstraint(
            model_name='termsdocument',
            constraint=models.UniqueConstraint(fields=('name', 'version'), name='unique_terms_name_version'),
        ),
        migrations.AddConstraint(
            model_name='termsdocument',
            constraint=models.UniqueConstraint(fields=('name', 'is_active'), name='unique_terms_name_active'),
        ),
        migrations.AddConstraint(
            model_name='userguidedocument',
            constraint=models.UniqueConstraint(fields=('name', 'version'), name='unique_guide_name_version'),
        ),
        migrations.AddConstraint(
            model_name='userguidedocument',
            constraint=models.UniqueConstraint(fields=('name', 'is_active'), name='unique_guide_name_active'),
        ),
    ]
