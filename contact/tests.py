from django.test import TestCase, override_settings
from unittest.mock import patch
from django.core import mail

from contact.email import send_contact_notification, send_contact_confirmation
from contact.models import ContactMessage  # Adjust the import path


class ContactEmailTest(TestCase):
    def setUp(self):
        # Create a test contact message instance
        self.contact_message = ContactMessage.objects.create(
            email="sender@example.com",
            subject="Test Subject",
            message="This is a test message.",
        )

    @patch("os.getenv")
    @patch("contact.email.render_to_string")
    def test_send_contact_notification(self, mock_render_to_string, mock_getenv):
        # Mock environment variable for recipient emails
        mock_getenv.return_value = "admin@example.com"

        # Mock the rendering of the HTML template
        mock_render_to_string.return_value = "<html>HTML content</html>"

        # Call the function
        send_contact_notification(self.contact_message)

        # Verify that an email was sent
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]

        # Check email subject, recipients, and content
        self.assertEqual(email.subject, "New contact form submission")
        self.assertEqual(email.to, ["admin@example.com"])
        self.assertIn(
            "Test Subject", email.body
        )  # Plain text content should contain the subject
        self.assertIn(
            "This is a test message.", email.body
        )  # Plain text content should contain the message

        # Check if the HTML alternative is correctly attached
        self.assertIn("<html>HTML content</html>", email.alternatives[0][0])
        self.assertEqual(email.alternatives[0][1], "text/html")

    @patch("contact.email.render_to_string")
    def test_send_contact_confirmation(self, mock_render_to_string):
        # Mock the rendering of the HTML template
        mock_render_to_string.return_value = "<html>Confirmation content</html>"

        # Call the function
        send_contact_confirmation(self.contact_message)

        # Verify that an email was sent
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]

        # Check email subject, recipients, and content
        self.assertEqual(email.subject, "Contact PsychoModels")
        self.assertEqual(email.to, ["sender@example.com"])
        self.assertIn(
            "Test Subject", email.body
        )  # Plain text content should contain the subject
        self.assertIn(
            "This is a test message.", email.body
        )  # Plain text content should contain the message

        # Check if the HTML alternative is correctly attached
        self.assertIn("<html>Confirmation content</html>", email.alternatives[0][0])
        self.assertEqual(email.alternatives[0][1], "text/html")
