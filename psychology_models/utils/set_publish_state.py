from django.utils import timezone
from django_currentuser.middleware import (
    get_current_authenticated_user,
)


def publish_psychology_model(queryset):
    now = timezone.now()

    for pm_instance in queryset:
        if pm_instance.published_at is None:
            pm_instance.published_at = now
            pm_instance.published_by = get_current_authenticated_user()
            pm_instance.save()

            if pm_instance.programming_language:
                pm_instance.programming_language.published_at = now
                pm_instance.programming_language.published_by = (
                    get_current_authenticated_user()
                )
                pm_instance.programming_language.save()

            related_models = [
                (pm_instance.framework.all()),
                (pm_instance.software_package.all()),
                (pm_instance.model_variable.all()),
                (pm_instance.psychology_discipline.all()),
            ]

            for related_instances in related_models:
                for related_instance in related_instances:
                    related_instance.published_at = now
                    related_instance.published_by = get_current_authenticated_user()
                    related_instance.save()

            for variable_instance in pm_instance.model_variable.all():
                variable_instance.published_at = now
                variable_instance.published_by = get_current_authenticated_user()
                variable_instance.save()


def unpublish_psychology_model(queryset):

    for pm_instance in queryset:
        if pm_instance.published_at is not None:
            pm_instance.published_at = None
            pm_instance.published_by = None
            pm_instance.save()


def publish_entity(queryset):
    now = timezone.now()

    for instance in queryset:
        if instance.published_at is None:
            instance.published_at = now
            instance.published_by = get_current_authenticated_user()
            instance.save()


def unpublish_entity(queryset):

    for instance in queryset:
        if instance.published_at is not None:
            instance.published_at = None
            instance.published_by = None
            instance.save()
