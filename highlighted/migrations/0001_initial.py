# Generated by Django 5.0.8 on 2024-08-26 14:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("psychology_models", "0021_psychologymodel_submission_remarks"),
    ]

    operations = [
        migrations.CreateModel(
            name="HighlightedFramework",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "framework",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="psychology_models.framework",
                    ),
                ),
            ],
        ),
    ]