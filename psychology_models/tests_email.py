from django.test import TestCase
from django.core import mail
from unittest.mock import patch
from django.urls import reverse

from members.models import User
from psychology_models.email import (
    send_submission_confirmation,
    send_submission_notification,
)
from psychology_models.models import PsychologyModel


class EmailNotificationTest(TestCase):
    def setUp(self):
        # Create a user with an email address for testing purposes
        self.user = User.objects.create_user(
            username="testuser", email="testuser@example.com", password="12345"
        )
        self.psychology_model = PsychologyModel.objects.create(
            title="Test Model",
            slug="test-model",
            created_by=self.user,
        )

    @patch("psychology_models.email.render_to_string")
    @patch("os.getenv")
    def test_send_submission_notification(self, mock_getenv, mock_render_to_string):
        # Mock environment variable to return a test email
        mock_getenv.return_value = "admin@example.com"
        # Mock template rendering
        mock_render_to_string.return_value = "<html>Test HTML content</html>"

        # Call the function
        send_submission_notification(self.psychology_model)

        # Verify the email was sent
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.subject, "New model submission")
        self.assertEqual(email.to, ["admin@example.com"])

        # Check if the HTML content is attached correctly
        self.assertIn("Test HTML content", email.alternatives[0][0])
        self.assertEqual(email.alternatives[0][1], "text/html")

        # Ensure the admin URL is in the plain text content
        admin_url = "https://www.psychomodels.org" + reverse(
            "admin:psychology_models_psychologymodel_change",
            args=[self.psychology_model.id],
        )
        self.assertIn(admin_url, email.body)

    @patch("psychology_models.email.render_to_string")
    def test_send_submission_confirmation(self, mock_render_to_string):
        # Mock template rendering
        mock_render_to_string.return_value = "<html>Test HTML content</html>"

        # Call the function
        send_submission_confirmation(self.psychology_model)

        # Verify the email was sent
        self.assertEqual(len(mail.outbox), 1)  # Ensure one email is sent
        email = mail.outbox[0]
        self.assertEqual(email.subject, "Your submission to PsychoModels")
        self.assertEqual(email.to, [self.user.email])

        # Check if the HTML content is attached correctly
        self.assertIn("Test HTML content", email.alternatives[0][0])
        self.assertEqual(email.alternatives[0][1], "text/html")

        # Ensure the model URL is in the plain text content
        model_url = "https://www.psychomodels.org" + reverse(
            "model_view", args=[self.psychology_model.slug]
        )
        self.assertIn(model_url, email.body)

    def test_send_submission_confirmation_no_email(self):
        # Create a psychology model without an associated user email
        user_no_email = User.objects.create_user(
            username="noemailuser", password="12345"
        )
        psychology_model_no_email = PsychologyModel.objects.create(
            title="Test Model No Email",
            slug="test-model-no-email",
            created_by=user_no_email,
        )

        # Call the function
        send_submission_confirmation(psychology_model_no_email)

        # Ensure no email is sent
        self.assertEqual(len(mail.outbox), 0)
