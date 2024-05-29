from django import forms
from django.core.mail import send_mail
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Psychmodel, Proposal, Framework


class SubmitModelForm(forms.Form):
    class Meta:
        model = Proposal
        fields = [
            "title",
            "description",
            "publication",
        ]

    model_name = forms.CharField(required=True)
    description = forms.CharField(widget=forms.Textarea, required=True)
    publication = forms.CharField(required=False)

    def save(self, commit=True):
        model = Proposal()
        model.title = self.cleaned_data["model_name"]
        model.description = self.cleaned_data["description"]
        model.publication = self.cleaned_data["publication"]
        if commit:
            model.save()
        return model


class PsychmodelForm(forms.ModelForm):
    class Meta:
        model = Psychmodel
        fields = [
            "model_name",
            "description",
            # "publication",
            # "authors",
            "framework",
            "softwarepackage",
            "language",
        ]


class FrameworkForm(forms.ModelForm):
    class Meta:
        model = Framework
        fields = [
            "framework_name",
            "framework_description",
            "parent_framework",
            "publication",
            "explanation",
        ]
