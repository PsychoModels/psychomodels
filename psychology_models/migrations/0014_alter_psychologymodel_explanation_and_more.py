# Generated by Django 5.0.7 on 2024-08-13 12:17

import django.db.models.deletion
import markdownx.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("psychology_models", "0013_alter_psychologydiscipline_created_by"),
    ]

    operations = [
        migrations.AlterField(
            model_name="psychologymodel",
            name="explanation",
            field=markdownx.models.MarkdownxField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="psychologymodel",
            name="programming_language",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="psychology_models.programminglanguage",
            ),
        ),
    ]
