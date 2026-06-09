from django.contrib import admin
from django.utils import timezone
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from django.contrib.auth.models import Group

from .models import User

admin.site.unregister(EmailAddress)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)
admin.site.unregister(Group)


class EmailAddressInline(admin.TabularInline):
    model = EmailAddress


class SocialAccountInline(admin.TabularInline):
    model = SocialAccount


class UserAdmin(admin.ModelAdmin):
    inlines = [EmailAddressInline, SocialAccountInline]
    exclude = ("password",)
    list_display = (
        "username",
        "email",
        "date_joined_display",
        "last_login_display",
    )

    @admin.display(description="Date joined", ordering="date_joined")
    def date_joined_display(self, obj):
        if not obj.date_joined:
            return "—"
        return timezone.localtime(obj.date_joined).strftime("%d-%m-%Y %H:%M")

    @admin.display(description="Last login", ordering="last_login")
    def last_login_display(self, obj):
        if not obj.last_login:
            return "—"
        return timezone.localtime(obj.last_login).strftime("%d-%m-%Y %H:%M")


admin.site.register(User, UserAdmin)
