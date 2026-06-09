from django.contrib import admin
from django.utils import timezone

from contact.models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "email", "created_at_display")
    readonly_fields = (
        "email",
        "subject",
        "message",
        "created_at_display",
        "updated_at_display",
    )

    @admin.display(description="Created at", ordering="created_at")
    def created_at_display(self, obj):
        return timezone.localtime(obj.created_at).strftime("%d-%m-%Y %H:%M")

    @admin.display(description="Updated at", ordering="updated_at")
    def updated_at_display(self, obj):
        return timezone.localtime(obj.updated_at).strftime("%d-%m-%Y %H:%M")

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False
