import os

import after_response
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse

from psychology_models.models import PsychologyModel


@after_response.enable
def send_submission_notification(psychology_model: PsychologyModel):
    subject = "New model submission"
    to_email = os.getenv("NOTIFY_EMAILS", "").split(",")
    admin_url = "https://www.psychomodels.org" + reverse(
        "admin:psychology_models_psychologymodel_change", args=[psychology_model.id]
    )
    # Load your HTML template
    html_content = render_to_string(
        "emails/model_submission_notification.html",
        {"psychology_model": psychology_model, "admin_url": admin_url},
    )

    # Convert HTML to plain text
    text_content = f"""
There is a new model submission from psychomodels.org.
Please review and publish the model in the admin panel:
{admin_url}.
        """

    email = EmailMultiAlternatives(subject, text_content, None, to_email)

    email.attach_alternative(html_content, "text/html")

    email.send()


@after_response.enable
def send_submission_confirmation(psychology_model: PsychologyModel):
    if not psychology_model.created_by or not psychology_model.created_by.email:
        return

    subject = "Your submission to PsychoModels"
    to_email = [psychology_model.created_by.email]
    model_url = "https://www.psychomodels.org" + reverse(
        "model_view", args=[psychology_model.slug]
    )
    # Load your HTML template
    html_content = render_to_string(
        "emails/model_submission_confirmation.html",
        {"psychology_model": psychology_model, "model_url": model_url},
    )

    # Convert HTML to plain text
    text_content = f"""
Thank you for submitting the model {psychology_model.title} to PsychoModels. We appreciate
your contribution to our growing repository of mathematical and computational
models that describe psychological and behavioral measurement, mechanisms, and
theories.

What happens next?
Your model will now undergo a review and curation process by our team. Once the
process is complete, the model will be made publicly available in the
PsychoModels database. We might contact you for additional details or
clarifications. You will receive an email when the model is published.

You can view your submitted model at any time by visiting the following link:
{model_url}
(You must be logged to view the model if it is not published yet.)

Thank you for contributing to PsychoModels!

PsychoModels https://www.psychomodels.org/
        """

    email = EmailMultiAlternatives(subject, text_content, None, to_email)

    email.attach_alternative(html_content, "text/html")

    email.send()
