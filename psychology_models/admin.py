from django.contrib import admin
from markdownx.admin import MarkdownxModelAdmin

from markdownx.widgets import AdminMarkdownxWidget

# Register your models here.
from . import models


class PublicationAdmin(admin.ModelAdmin):
    filter_horizontal = ["authors"]


class PsychologyModelAdmin(admin.ModelAdmin):
    list_display = ["title"]
    filter_horizontal = ["framework"]

    actions = []


admin.site.register(models.Author)
admin.site.register(models.PsychologyModel, PsychologyModelAdmin)
admin.site.register(models.Proposal)
admin.site.register(models.Variable)
admin.site.register(models.Modelvariable)
admin.site.register(models.Language)
admin.site.register(models.Framework, MarkdownxModelAdmin)
admin.site.register(models.Psychfield)
admin.site.register(models.Publication, PublicationAdmin)
admin.site.register(models.Softwarepackage)
admin.site.register(models.Measurementinstrument)
