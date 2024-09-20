import os

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse

from contact.models import ContactMessage


def send_contact_notification(contact_message: ContactMessage):
    subject = "New contact form submission"
    to_email = os.getenv("NOTIFY_EMAILS", "").split(",")
    admin_url = "https://www.psychomodels.org" + reverse(
        "admin:contact_contactmessage_change", args=[contact_message.id]
    )
    # Load your HTML template
    html_content = render_to_string(
        "emails/contact_notification.html",
        {"contact_message": contact_message, "admin_url": admin_url},
    )

    # Convert HTML to plain text
    text_content = f"""
There is a new contact form submission from psychomodels.org.
You can view the details below or in the admin panel:
{admin_url}.

Sender e-mail: {contact_message.email}

Subject: {contact_message.subject}

Message:

{contact_message.message}
        """

    email = EmailMultiAlternatives(subject, text_content, None, to_email)

    email.attach_alternative(html_content, "text/html")

    email.send()


def send_contact_confirmation(contact_message: ContactMessage):
    subject = "Contact PsychoModels"
    to_email = [contact_message.email]
    # Load your HTML template
    html_content = render_to_string(
        "emails/contact_confirmation.html",
        {"contact_message": contact_message},
    )

    # Convert HTML to plain text
    text_content = f"""
Thank you for contacting PsychoModels. We have received your message and
will get back to you as soon as possible.

Subject: {contact_message.subject}

Your message:

{contact_message.message}
"""

    email = EmailMultiAlternatives(subject, text_content, None, to_email)

    email.attach_alternative(html_content, "text/html")

    email.send()
