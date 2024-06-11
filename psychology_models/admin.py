from django.contrib import admin
from markdownx.admin import MarkdownxModelAdmin

from . import models

admin.site.register(models.Author)
admin.site.register(models.PsychologyModel)
admin.site.register(models.Variable)
admin.site.register(models.ModelVariable)
admin.site.register(models.ProgrammingLanguage)
admin.site.register(models.Framework, MarkdownxModelAdmin)
admin.site.register(models.PsychologyField)
admin.site.register(models.Publication)
admin.site.register(models.SoftwarePackage)
