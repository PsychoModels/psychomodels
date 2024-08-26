from django.contrib import admin

from highlighted.models import (
    HighlightedFramework,
    HighlightedPsychologyModel,
    HighlightedPsychologyDiscipline,
    HighlightedProgrammingLanguage,
)
from psychology_models.models import (
    Framework,
    PsychologyModel,
    PsychologyDiscipline,
    ProgrammingLanguage,
)


@admin.register(HighlightedFramework)
class HighlightedFrameworkAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        return False

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if db_field.name == "framework":
            kwargs["queryset"] = Framework.objects.filter(published_at__isnull=False)
        return super(HighlightedFrameworkAdmin, self).formfield_for_foreignkey(
            db_field, request, **kwargs
        )


@admin.register(HighlightedPsychologyModel)
class HighlightedPsychologyModelAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        return False

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if db_field.name == "psychology_model":
            kwargs["queryset"] = PsychologyModel.objects.filter(
                published_at__isnull=False
            )
        return super(HighlightedPsychologyModelAdmin, self).formfield_for_foreignkey(
            db_field, request, **kwargs
        )


@admin.register(HighlightedPsychologyDiscipline)
class HighlightedPsychologyDisciplineAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        return False

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if db_field.name == "psychology_discipline":
            kwargs["queryset"] = PsychologyDiscipline.objects.filter(
                published_at__isnull=False
            )
        return super(
            HighlightedPsychologyDisciplineAdmin, self
        ).formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(HighlightedProgrammingLanguage)
class HighlightedProgrammingLanguageAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):

        return False

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if db_field.name == "programming_language":
            kwargs["queryset"] = ProgrammingLanguage.objects.filter(
                published_at__isnull=False
            )
        return super(
            HighlightedProgrammingLanguageAdmin, self
        ).formfield_for_foreignkey(db_field, request, **kwargs)
