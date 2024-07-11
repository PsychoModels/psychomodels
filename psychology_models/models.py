from algoliasearch_django import AlgoliaIndex
from django.db import models
from django.urls import reverse
from autoslug import AutoSlugField

from django_currentuser.db.models import CurrentUserField

from markdownx.models import MarkdownxField
from markdownx.utils import markdownify


class ProgrammingLanguage(models.Model):
    name = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    created_by = CurrentUserField(related_name="programming_language_created_by")
    updated_by = CurrentUserField(
        on_update=True, related_name="programming_language_updated_by"
    )
    published_by = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        editable=False,
        related_name="programming_language_published_by",
    )

    def __str__(self):
        return self.name


class Framework(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)
    parent_framework = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True
    )

    explanation = MarkdownxField(null=True, blank=True)

    publication_doi = models.CharField(null=True, blank=True)
    publication_csl_json = models.JSONField(null=True, blank=True)
    publication_csl_fetched_at = models.DateTimeField(null=True, blank=True)
    publication_citation = models.TextField(null=True, blank=True)
    publication_citation_fetched_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    created_by = CurrentUserField(related_name="framework_created_by")
    updated_by = CurrentUserField(on_update=True, related_name="framework_updated_by")
    published_by = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        editable=False,
        related_name="framework_published_by",
    )

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

    created_by = CurrentUserField(related_name="software_package_created_by")
    updated_by = CurrentUserField(
        on_update=True, related_name="software_package_updated_by"
    )
    published_by = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        editable=False,
        related_name="software_package_published_by",
    )

    def __str__(self):
        return self.name


class PsychologyDiscipline(models.Model):
    name = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    created_by = CurrentUserField(related_name="psychology_discipline_created_by")
    updated_by = CurrentUserField(
        on_update=True, related_name="psychology_discipline_updated_by"
    )
    published_by = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        editable=False,
        related_name="psychology_discipline_published_by",
    )

    def __str__(self):
        return self.name


class Variable(models.Model):
    name = models.CharField()
    description = models.TextField(max_length=1500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    created_by = CurrentUserField(related_name="variable_created_by")
    updated_by = CurrentUserField(on_update=True, related_name="variable_updated_by")
    published_by = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        editable=False,
        related_name="variable_published_by",
    )

    def __str__(self):
        return self.name


class PsychologyModel(models.Model):
    title = models.CharField()
    description = models.TextField(max_length=3000)
    explanation = MarkdownxField(null=True)

    publication_doi = models.CharField(null=True, blank=True)
    publication_csl_json = models.JSONField(null=True, blank=True)
    publication_csl_fetched_at = models.DateTimeField(null=True, blank=True)
    publication_citation = models.TextField(null=True, blank=True)
    publication_citation_fetched_at = models.DateTimeField(null=True, blank=True)

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

    created_by = CurrentUserField(related_name="psychology_model_created_by")
    updated_by = CurrentUserField(
        on_update=True, related_name="psychology_model_updated_by"
    )
    published_by = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        editable=False,
        related_name="psychology_model_published_by",
    )

    def get_absolute_url(self):
        return reverse("model_view", kwargs={"slug": self.slug})

    @property
    def formatted_explanation(self):
        return markdownify(self.explanation)

    def programming_language_name(self):
        return self.programming_language.name

    def is_published(self):
        return self.published_at is not None

    def framework_names(self):
        return [framework.name for framework in self.framework.all()]

    def psychology_discipline_names(self):
        return [discipline.name for discipline in self.psychology_discipline.all()]

    def publication_authors(self):
        if self.publication_csl_json is None:
            return []
        authors = self.publication_csl_json.get("author", [])
        # TODO: discuss this
        return [author["family"] for author in authors]

    def __str__(self):
        return self.title


class ModelVariable(models.Model):
    model_id = models.ForeignKey(
        PsychologyModel, related_name="Variables", on_delete=models.RESTRICT
    )
    variable_id = models.ForeignKey(Variable, null=True, on_delete=models.SET_NULL)

    name = models.CharField()
    details = models.TextField(max_length=1500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    created_by = CurrentUserField(related_name="model_variable_created_by")
    updated_by = CurrentUserField(
        on_update=True, related_name="model_variable_updated_by"
    )
    published_by = models.ForeignKey(
        "members.User",
        on_delete=models.SET_NULL,
        null=True,
        editable=False,
        related_name="model_variable_published_by",
    )

    def __str__(self):
        return self.name
