from django.db import models
from django.urls import reverse
from autoslug import AutoSlugField

from markdownx.models import MarkdownxField
from markdownx.utils import markdownify


class Author(models.Model):
    name = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.name


class Publication(models.Model):
    url = models.URLField()
    title = models.CharField()
    authors = models.ManyToManyField(Author)

    year = models.IntegerField(null=True, blank=True)
    outlet = models.CharField(null=True, blank=True)
    volume = models.IntegerField(null=True, blank=True)
    issue = models.IntegerField(null=True, blank=True)
    pages = models.CharField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.title


class ProgrammingLanguage(models.Model):
    name = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.name


class Framework(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)
    parent_framework = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True
    )
    publication = models.ForeignKey(
        Publication, on_delete=models.SET_NULL, null=True, blank=True
    )
    explanation = MarkdownxField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    @property
    def formatted_explanation(self):
        return markdownify(self.explanation)

    def __str__(self):
        return self.name


class SoftwarePackage(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)
    documentation = models.URLField(null=True, blank=True)
    code_repository_url = models.URLField(null=True, blank=True)
    programming_language = models.ForeignKey(
        "ProgrammingLanguage", on_delete=models.PROTECT
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.name


class PsychologyField(models.Model):
    discipline_name = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.discipline_name


class Variable(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.name


class PsychologyModel(models.Model):
    submitting_user = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="submitting_user",
    )

    reviewer = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="reviewer",
        editable=False,
    )

    publication = models.OneToOneField(Publication, on_delete=models.PROTECT)

    title = models.CharField()
    description = models.TextField(max_length=3000)
    explanation = MarkdownxField(null=True)

    programming_language = models.ForeignKey(
        "ProgrammingLanguage", on_delete=models.PROTECT
    )
    framework = models.ManyToManyField(Framework)
    software_package = models.ManyToManyField(SoftwarePackage, blank=True)
    psychology_field = models.ManyToManyField(PsychologyField, blank=True)

    code_repository_url = models.URLField(null=True, blank=True)
    data_url = models.URLField(null=True, blank=True)

    model_variables = models.ManyToManyField(
        Variable, through="ModelVariable", blank=True
    )

    slug = AutoSlugField(populate_from="title")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)

    def get_absolute_url(self):
        return reverse("model_view", kwargs={"slug": self.slug})

    @property
    def formatted_explanation(self):
        return markdownify(self.explanation)

    def __str__(self):
        return self.title


class ModelVariable(models.Model):
    model_id = models.ForeignKey(
        PsychologyModel, related_name="Variables", on_delete=models.RESTRICT
    )
    variable_id = models.ForeignKey(Variable, null=True, on_delete=models.SET_NULL)

    details = models.TextField(max_length=1500, null=True, blank=True)
    reference = models.CharField(max_length=12, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True)
