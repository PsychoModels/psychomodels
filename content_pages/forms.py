from django import forms
from django.core.mail import send_mail


class ContactForm(forms.Form):
    name = forms.CharField(required=True)
    email = forms.EmailField(required=True)
    subject = forms.CharField(max_length=100, required=True)
    message = forms.CharField(widget=forms.Textarea, required=True)
    cc_myself = forms.BooleanField(
        required=False, label="Send a copy to yourself", initial=True
    )

    def send_email(self, recipients: list = None):
        if self.is_valid() and recipients is not None:
            # name = self.cleaned_data["name"]
            sender = self.cleaned_data["email"]
            subject = self.cleaned_data["subject"]
            message = self.cleaned_data["message"]
            cc_myself = self.cleaned_data["cc_myself"]

            if cc_myself:
                recipients.append(sender)
            send_mail(subject, message, sender, recipients)
