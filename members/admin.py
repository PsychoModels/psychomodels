from django.contrib import admin
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


admin.site.register(User, UserAdmin)
