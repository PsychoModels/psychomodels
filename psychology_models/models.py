from algoliasearch_django import AlgoliaIndex
from django.db import models
from django.urls import reverse
from autoslug import AutoSlugField

from markdownx.models import MarkdownxField
from markdownx.utils import markdownify


class ProgrammingLanguage(models.Model):
    name = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class Framework(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)
    parent_framework = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True
    )

    explanation = MarkdownxField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    @property
    def formatted_explanation(self):
        return markdownify(self.explanation)

    def __str__(self):
        return self.name


class SoftwarePackage(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)
    documentation_url = models.URLField(null=True, blank=True)
    code_repository_url = models.URLField(null=True, blank=True)
    programming_language = models.ForeignKey(
        "ProgrammingLanguage", on_delete=models.PROTECT
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class PsychologyDiscipline(models.Model):
    name = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class Variable(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

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

    title = models.CharField()
    description = models.TextField(max_length=3000)
    explanation = MarkdownxField(null=True)

    publication_doi = models.CharField(null=True)
    publication_csl_json = models.JSONField(null=True)
    publication_csl_fetched_at = models.DateTimeField(null=True)
    publication_citation = models.TextField(null=True)
    publication_citation_fetched_at = models.DateTimeField(null=True)

    programming_language = models.ForeignKey(
        "ProgrammingLanguage", on_delete=models.PROTECT
    )
    framework = models.ManyToManyField(Framework)
    software_package = models.ManyToManyField(SoftwarePackage, blank=True)
    psychology_discipline = models.ManyToManyField(PsychologyDiscipline, blank=True)

    code_repository_url = models.URLField(null=True, blank=True)
    data_url = models.URLField(null=True, blank=True)

    model_variables = models.ManyToManyField(
        Variable, through="ModelVariable", blank=True
    )

    slug = AutoSlugField(populate_from="title")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def get_absolute_url(self):
        return reverse("model_view", kwargs={"slug": self.slug})

    @property
    def formatted_explanation(self):
        return markdownify(self.explanation)

    def is_published(self):
        return self.is_published is not None

    class ContactIndex(AlgoliaIndex):
        should_index = "is_published"

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
    published_at = models.DateTimeField(null=True, blank=True)
