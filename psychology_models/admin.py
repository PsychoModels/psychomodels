from django.contrib import admin
from django.utils.html import format_html
from django_object_actions import (
    DjangoObjectActions,
    action,
    takes_instance_or_queryset,
)

from . import models
from .utils.set_publish_state import (
    publish_psychology_model,
    unpublish_psychology_model,
    publish_entity,
    unpublish_entity,
)


@admin.action(description="Publish selected psychology models")
def action_publish_psychology_model(modeladmin, request, queryset):
    publish_psychology_model(queryset)


@admin.action(description="Unpublish selected psychology models")
def action_unpublish_psychology_model(modeladmin, request, queryset):
    unpublish_psychology_model(queryset)


@admin.action(description="Publish selected entries")
def action_publish(modeladmin, request, queryset):
    publish_entity(queryset)


@admin.action(description="Unpublish selected entries")
def action_unpublish(modeladmin, request, queryset):
    unpublish_entity(queryset)


def published_state(self, obj):
    if obj.published_at is not None:
        return format_html(
            '<span style="background-color: #c5fcd8; padding:0.125rem 0.5rem; border-radius:4px;">Published</span>'
        )
    else:
        return format_html(
            '<span style="background-color: #fef5e1; padding:0.125rem 0.5rem; border-radius:4px;">Not Published</span>'
        )


class PsychologyModelAdmin(DjangoObjectActions, admin.ModelAdmin):
    @action(label="Publish", description="Publish this model")  # optional
    @takes_instance_or_queryset
    def publish_this(self, request, obj):
        action_publish_psychology_model(self, request, obj)

    @action(label="Unpublish", description="Unpublish this model")  # optional
    @takes_instance_or_queryset
    def unpublish_this(self, request, obj):
        action_unpublish_psychology_model(self, request, obj)

    change_actions = ("publish_this", "unpublish_this")

    readonly_fields = (
        "publication_csl_json",
        "publication_citation",
        "published_at",
        "published_by",
    )
    exclude = (
        "publication_csl_fetched_at",
        "publication_citation_fetched_at",
    )
    list_display = ("title", "published_state")
    actions = [action_publish_psychology_model, action_unpublish_psychology_model]

    def published_state(self, obj):
        return published_state(self, obj)

    def get_change_actions(self, request, object_id, form_url):
        actions = super(PsychologyModelAdmin, self).get_change_actions(
            request, object_id, form_url
        )
        actions = list(actions)

        obj = self.model.objects.get(pk=object_id)
        if obj.published_at is not None:
            actions.remove("publish_this")
        if obj.published_at is None:
            actions.remove("unpublish_this")

        return actions


class AdminMixin:
    actions = [action_publish, action_unpublish]

    def published_state(self, obj):
        return published_state(self, obj)


class FrameworkAdmin(AdminMixin, admin.ModelAdmin):
    readonly_fields = ("publication_csl_json", "publication_citation", "published_at")
    exclude = (
        "publication_csl_fetched_at",
        "publication_citation_fetched_at",
    )
    list_display = ("name", "published_state")


class VariableAdmin(AdminMixin, admin.ModelAdmin):
    readonly_fields = ("published_at",)
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class ModelVariableAdmin(AdminMixin, admin.ModelAdmin):
    readonly_fields = ("published_at",)
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class ProgrammingLanguageAdmin(AdminMixin, admin.ModelAdmin):
    readonly_fields = ("published_at",)
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class PsychologyDisciplineAdmin(AdminMixin, admin.ModelAdmin):
    readonly_fields = ("published_at",)
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class SoftwarePackageAdmin(AdminMixin, admin.ModelAdmin):
    readonly_fields = ("published_at",)
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


admin.site.register(models.PsychologyModel, PsychologyModelAdmin)
admin.site.register(models.Variable, VariableAdmin)
admin.site.register(models.ModelVariable, ModelVariableAdmin)
admin.site.register(models.ProgrammingLanguage, ProgrammingLanguageAdmin)
admin.site.register(models.Framework, FrameworkAdmin)
admin.site.register(models.PsychologyDiscipline, PsychologyDisciplineAdmin)
admin.site.register(models.SoftwarePackage, SoftwarePackageAdmin)
