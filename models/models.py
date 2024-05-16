from django.db import models
from django.urls import reverse
from django.utils.text import slugify

from hashlib import sha256

from markdownx.models import MarkdownxField
from markdownx.utils import markdownify


class Author(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254, null=True, blank=True)
    institution = models.CharField(max_length=200, null=True, blank=True)
    # phone = models.CharField(max_length=200)
    # address = models.CharField(max_length=200)
    # city = models.CharField(max_length=200)
    # state = models.CharField(max_length=200)
    # zip = models.CharField(max_length=200)
    # country = models.CharField(max_length=200)
    # role = models.CharField(max_length=200)

    user = models.OneToOneField(
        "members.User", on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.first_name + " " + self.last_name


class Publication(models.Model):
    unique_identifier = models.URLField(max_length=254, unique=True)
    title = models.CharField(max_length=200)
    authors = models.ManyToManyField(Author)

    year = models.IntegerField(null=True)
    outlet = models.CharField(max_length=200, null=True, blank=True)
    volume = models.IntegerField(null=True, blank=True)
    issue = models.IntegerField(null=True, blank=True)
    pages = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        auths = self.authors.all()
        aut = f"{auths[0].last_name}, {auths[0].first_name[0]}"
        if len(auths) > 1:
            aut += f", et al"
        out_str = f"{aut}"
        if self.year is not None:
            out_str += f". ({self.year})"
        out_str += f". {self.title}"
        out_str += f". {self.outlet}" if self.outlet is not None else ""
        out_str += f", {self.volume}" if self.volume is not None else ""
        out_str += f"({self.issue})" if self.issue is not None else ""
        out_str += f": {self.pages}." if self.pages is not None else "."

        return out_str


class Language(models.Model):
    language_name = models.CharField(max_length=200)
    language_documentation = models.CharField(max_length=200)

    def __str__(self):
        return self.language_name


class Framework(models.Model):
    framework_name = models.CharField(max_length=200)
    framework_description = models.TextField(max_length=1500, null=True, blank=True)
    parent_framework = models.ForeignKey(
        "self", on_delete=models.DO_NOTHING, null=True, blank=True
    )
    publication = models.ForeignKey(
        Publication, on_delete=models.DO_NOTHING, null=True, blank=True
    )

    explanation = MarkdownxField(null=True, blank=True)

    @property
    def formatted_explanation(self):
        return markdownify(self.explanation)

    def __str__(self):
        return self.framework_name


class Softwarepackage(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(max_length=1500, null=True, blank=True)
    documentation = models.URLField(max_length=254, null=True, blank=True)
    language = models.ForeignKey("Language", on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name


class Psychfield(models.Model):
    discipline_name = models.CharField(max_length=200)

    def __str__(self):
        return self.discipline_name


class Variable(models.Model):
    variable_name = models.CharField(max_length=200)
    variable_description = models.TextField(max_length=200)

    def __str__(self):
        return self.variable_name


class Measurementinstrument(models.Model):
    instrument_name = models.CharField(max_length=200)
    instrument_description = models.TextField(max_length=200, null=True)
    instrument_publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    additional_details = models.CharField(max_length=200, null=True, blank=True)
    variables = models.ManyToManyField(Variable, blank=True)

    def __str__(self):
        return self.instrument_name


class Psychmodel(models.Model):
    submitting_user = models.ForeignKey(
        "members.User",
        on_delete=models.DO_NOTHING,
        null=True,
        related_name="submitting_user",
    )
    # co_authors = models.ManyToManyField("auth.User", related_name="co_authors")
    reviewer = models.ForeignKey(
        "members.User",
        on_delete=models.DO_NOTHING,
        null=True,
        related_name="reviewer",
        editable=False,
    )

    reviewed = models.BooleanField(default=False)
    # slug = models.SlugField(max_length=8, unique=True, editable=False, null=True)

    publication = models.OneToOneField(Publication, on_delete=models.CASCADE)

    model_name = models.CharField(max_length=200, unique=True)
    description = models.TextField(max_length=3000)
    explanation = MarkdownxField(null=True, blank=True)
    # how_to_use_it = models.CharField(max_length=3000)
    created_at = models.DateTimeField(auto_now_add=True)
    language = models.ForeignKey("language", on_delete=models.DO_NOTHING)
    framework = models.ManyToManyField(Framework)
    softwarepackage = models.ManyToManyField(Softwarepackage, blank=True)
    psychfield = models.ManyToManyField(Psychfield, blank=True)

    codeURL = models.URLField(max_length=254, null=True, blank=True)
    dataURL = models.URLField(max_length=254, null=True, blank=True)

    # model_file = models.FileField(upload_to="models/")
    model_variables = models.ManyToManyField(
        Variable, through="ModelVariable", blank=True
    )

    def __str__(self):
        return self.model_name

    # def create_slug(self, date=None):
    #    if date is None:
    #        date = self.created_at.strftime("%Y-%m-%d_%H:%M:%S")
    #    slug = sha256(date.encode("utf-8"), usedforsecurity=False).hexdigest()[:10]
    #    return slug

    # def save(self, *args, **kwargs):
    #    if not self.pk:
    #        self.slug = slugify(self.create_slug())
    #    super(PsychModel, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("model_view", kwargs={"slug": self.slug})

    @property
    def formatted_explanation(self):
        return markdownify(self.explanation)


class Proposal(models.Model):
    title = models.CharField(max_length=200, default="New Model")
    description = models.TextField(max_length=3000, null=True, blank=True)
    publication = models.CharField(max_length=200, null=True, blank=True)

    # def save_to_model(self, *args, **kwargs):
    #     super(PsychModel, self).save(*args, **kwargs)

    def __str__(self):
        return self.title


class Modelvariable(models.Model):
    modelId = models.ForeignKey(
        Psychmodel, on_delete=models.CASCADE, related_name="modelvariables"
    )
    variableId = models.ForeignKey(Variable, on_delete=models.CASCADE, null=True)
    # variable_value = models.FloatField()
    # variable_measurement_unit = models.CharField(max_length=200)
    name = models.CharField(max_length=200, null=True)
    measurementinstrument = models.ForeignKey(
        Measurementinstrument, on_delete=models.DO_NOTHING, null=True, blank=True
    )
    details = models.TextField(max_length=1500, null=True, blank=True)

    def __str__(self):
        return self.name


class Behaviour(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=1500)

    def __str__(self):
        return self.name
