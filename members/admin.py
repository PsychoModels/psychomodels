from django.contrib import admin
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken

from .models import User

admin.site.unregister(EmailAddress)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)


class EmailAddressInline(admin.TabularInline):
    model = EmailAddress


class SocialAccountInline(admin.TabularInline):
    model = SocialAccount


class UserAdmin(admin.ModelAdmin):
    inlines = [EmailAddressInline, SocialAccountInline]


admin.site.register(User, UserAdmin)
