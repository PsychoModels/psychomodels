# Generated by Django 4.2.3 on 2023-07-11 21:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("models", "0004_alter_framework_framework_description_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="publication",
            name="issue",
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name="publication",
            name="outlet",
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name="publication",
            name="pages",
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name="publication",
            name="volume",
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name="publication",
            name="year",
            field=models.IntegerField(null=True),
        ),
    ]