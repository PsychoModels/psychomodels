# Generated by Django 5.0.6 on 2024-07-03 09:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        (
            "psychology_models",
            "0005_rename_psychologyfield_psychologydiscipline_and_more",
        ),
    ]

    operations = [
        migrations.RenameField(
            model_name="psychologydiscipline",
            old_name="discipline_name",
            new_name="name",
        ),
    ]
