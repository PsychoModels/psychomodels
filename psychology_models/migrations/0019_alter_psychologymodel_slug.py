# Generated by Django 5.0.8 on 2024-08-21 10:56

import autoslug.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("psychology_models", "0018_psychologymodel_model_variable"),
    ]

    operations = [
        migrations.AlterField(
            model_name="psychologymodel",
            name="slug",
            field=autoslug.fields.AutoSlugField(
                editable=False, populate_from="title", unique=True
            ),
        ),
    ]