# Generated by Django 5.1.1 on 2025-02-11 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("psychology_models", "0024_psychologymodeldraft"),
    ]

    operations = [
        migrations.AddField(
            model_name="psychologymodel",
            name="published_pending_moderation_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
