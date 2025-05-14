from django.contrib import admin
from django.utils.html import format_html
from django_object_actions import (
    DjangoObjectActions,
    action,
    takes_instance_or_queryset,
)
from django.contrib import messages
from import_export.admin import ImportExportModelAdmin

from . import models
from .utils.get_doi_citations import get_doi_citations
from .utils.set_publish_state import (
    publish_psychology_model,
    publish_psychology_model_pending_moderation,
    unpublish_psychology_model,
    publish_entity,
    unpublish_entity,
)


@admin.action(description="Publish selected psychology models")
def action_publish_psychology_model(modeladmin, request, queryset):
    publish_psychology_model(queryset)

@admin.action(description="Publish pending moderation selected psychology models")
def action_publish_psychology_model_pending_moderation(modeladmin, request, queryset):
    publish_psychology_model_pending_moderation(queryset)


@admin.action(description="Unpublish selected psychology models")
def action_unpublish_psychology_model(modeladmin, request, queryset):
    unpublish_psychology_model(queryset)


@admin.action(description="Publish selected entries")
def action_publish(modeladmin, request, queryset):
    publish_entity(queryset)


@admin.action(description="Unpublish selected entries")
def action_unpublish(modeladmin, request, queryset):
    unpublish_entity(queryset)


@admin.action(description="Fetch citation for publications")
def action_get_doi_citations(modeladmin, request, queryset, refetch=False):
    result_messages = get_doi_citations(queryset, refetch=refetch)
    for result_message in result_messages:
        messages.add_message(request, result_message[1], result_message[0])


def published_state(self, obj):
    if obj.published_at is not None:
        return format_html(
            '<span style="background-color: #c5fcd8; padding:0.125rem 0.5rem; border-radius:4px;">Published</span>'
        )
    else:
        if hasattr(obj, 'published_pending_moderation_at') and obj.published_pending_moderation_at is not None:
            return format_html(
                '<span style="background-color: #FFB74D; padding:0.125rem 0.5rem; border-radius:4px;">Published Post-moderation</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #fef5e1; padding:0.125rem 0.5rem; border-radius:4px;">Not Published</span>'
            )


class AdminMixin(ImportExportModelAdmin, admin.ModelAdmin):
    actions = [action_publish, action_unpublish]

    def published_state(self, obj):
        return published_state(self, obj)


class PsychologyModelAdmin(DjangoObjectActions, AdminMixin):
    @action(label="Publish", description="Publish this model")
    @takes_instance_or_queryset
    def publish_this(self, request, obj):
        action_publish_psychology_model(self, request, obj)

    @action(label="Publish pending moderation", description="Publish this model pending moderation")
    @takes_instance_or_queryset
    def publish_this_pending_moderation(self, request, obj):
        action_publish_psychology_model_pending_moderation(self, request, obj)

    @action(label="Unpublish", description="Unpublish this model")
    @takes_instance_or_queryset
    def unpublish_this(self, request, obj):
        action_unpublish_psychology_model(self, request, obj)

    @action(
        label="(Re)-fetch citation", description="(Re)-fetch citation for publications"
    )
    @takes_instance_or_queryset
    def get_doi_citations(self, request, obj):
        action_get_doi_citations(self, request, obj, True)

    change_actions = ("publish_this", "unpublish_this", "get_doi_citations")

    readonly_fields = (
        "publication_citation",
        "created_at",
        "published_pending_moderation_at",
        "published_at",
        "published_by",
    )
    exclude = (
        "publication_csl_json",
        "publication_csl_fetched_at",
        "publication_citation_fetched_at",
    )
    list_display = ("title", "published_state")
    actions = [
        action_publish_psychology_model,
        action_publish_psychology_model_pending_moderation,
        action_unpublish_psychology_model,
        action_get_doi_citations,
    ]

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


class FrameworkAdmin(DjangoObjectActions, AdminMixin):
    @action(label="Fetch citation", description="(Re)-fetch citation for publications")
    @takes_instance_or_queryset
    def get_doi_citations(self, request, obj):
        action_get_doi_citations(self, request, obj, True)

    change_actions = ("get_doi_citations",)

    actions = [action_publish, action_unpublish, action_get_doi_citations]

    def published_state(self, obj):
        return published_state(self, obj)

    readonly_fields = ("created_at", "publication_citation", "published_at")
    exclude = (
        "publication_csl_json",
        "publication_csl_fetched_at",
        "publication_citation_fetched_at",
    )
    list_display = ("name", "published_state")


class VariableAdmin(AdminMixin):
    readonly_fields = ("created_at", "published_at")
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class ModelVariableAdmin(AdminMixin):
    readonly_fields = ("created_at", "published_at")
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class ProgrammingLanguageAdmin(AdminMixin):
    readonly_fields = ("created_at", "published_at")
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class PsychologyDisciplineAdmin(AdminMixin):
    readonly_fields = ("created_at", "published_at")
    list_display = ("name", "published_state")

    def published_state(self, obj):
        return published_state(self, obj)


class SoftwarePackageAdmin(AdminMixin):
    readonly_fields = ("created_at", "published_at")
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
