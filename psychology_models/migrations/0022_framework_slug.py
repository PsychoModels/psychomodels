# Generated by Django 5.0.8 on 2024-08-29 13:45

import autoslug.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("psychology_models", "0021_psychologymodel_submission_remarks"),
    ]

    operations = [
        migrations.AddField(
            model_name="framework",
            name="slug",
            field=autoslug.fields.AutoSlugField(
                default=None,
                editable=False,
                null=True,
                populate_from="name",
                unique=True,
            ),
        ),
    ]