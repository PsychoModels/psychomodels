# Generated by Django 4.2.3 on 2023-12-06 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("models", "0013_framework_publication_alter_parameter_framework"),
    ]

    operations = [
        migrations.CreateModel(
            name="Proposal",
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
                ("title", models.CharField(default="New Model", max_length=200)),
                (
                    "description",
                    models.TextField(blank=True, max_length=3000, null=True),
                ),
                (
                    "publication",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
            ],
        ),
        migrations.DeleteModel(
            name="ProposedModel",
        ),
    ]