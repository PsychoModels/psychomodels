# Generated by Django 4.2.3 on 2023-07-17 06:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("models", "0010_alter_author_email_alter_author_institution_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="framework",
            name="framework_description",
            field=models.TextField(blank=True, max_length=1500, null=True),
        ),
        migrations.AlterField(
            model_name="measurementinstrument",
            name="instrument_description",
            field=models.TextField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name="modelparameter",
            name="details",
            field=models.TextField(blank=True, max_length=1500, null=True),
        ),
        migrations.AlterField(
            model_name="modelvariable",
            name="details",
            field=models.TextField(blank=True, max_length=1500, null=True),
        ),
        migrations.AlterField(
            model_name="parameter",
            name="parameter_description",
            field=models.TextField(max_length=1500),
        ),
        migrations.AlterField(
            model_name="psychmodel",
            name="description",
            field=models.TextField(max_length=3000),
        ),
        migrations.AlterField(
            model_name="psychmodel",
            name="how_does_it_work",
            field=models.TextField(blank=True, max_length=3000, null=True),
        ),
        migrations.AlterField(
            model_name="psychmodel",
            name="reviewer",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="reviewer",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="psychmodel",
            name="submitting_user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="submitting_user",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="softwarepackage",
            name="package_description",
            field=models.TextField(max_length=1500),
        ),
        migrations.AlterField(
            model_name="variable",
            name="variable_description",
            field=models.TextField(max_length=200),
        ),
    ]