# Generated by Django 5.0.7 on 2024-08-19 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("psychology_models", "0014_alter_psychologymodel_explanation_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="modelvariable",
            old_name="model_id",
            new_name="model",
        ),
        migrations.RenameField(
            model_name="modelvariable",
            old_name="variable_id",
            new_name="variable",
        ),
        migrations.AlterField(
            model_name="programminglanguage",
            name="name",
            field=models.CharField(unique=True),
        ),
        migrations.AlterField(
            model_name="psychologydiscipline",
            name="name",
            field=models.CharField(unique=True),
        ),
    ]