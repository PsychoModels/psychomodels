from django.contrib import admin
from markdownx.admin import MarkdownxModelAdmin

from . import models


class PsychologyModelAdmin(admin.ModelAdmin):
    exclude = (
        "publication_csl_json",
        "publication_csl_fetched_at",
        "publication_citation",
        "publication_citation_fetched_at",
    )


admin.site.register(models.PsychologyModel, PsychologyModelAdmin)
admin.site.register(models.Variable)
admin.site.register(models.ModelVariable)
admin.site.register(models.ProgrammingLanguage)
admin.site.register(models.Framework, MarkdownxModelAdmin)
admin.site.register(models.PsychologyDiscipline)
admin.site.register(models.SoftwarePackage)
