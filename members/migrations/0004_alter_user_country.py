# Generated by Django 5.0.8 on 2024-08-22 10:01

import django_countries.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("members", "0003_user_country_user_department_user_university_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="country",
            field=django_countries.fields.CountryField(max_length=2, null=True),
        ),
    ]
