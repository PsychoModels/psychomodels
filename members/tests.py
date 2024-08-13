from django.test import TestCase
from django_countries.fields import Country

from members.models import User


class UserModelTest(TestCase):
    def setUp(self):
        # Create a user for testing
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123",
            first_name="Test",
            last_name="User",
            university="Test University",
            department="Computer Science",
            country="US",
        )

    def test_user_creation(self):
        """Test that a user can be created with custom fields."""
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "testuser@example.com")
        self.assertEqual(self.user.first_name, "Test")
        self.assertEqual(self.user.last_name, "User")
        self.assertEqual(self.user.university, "Test University")
        self.assertEqual(self.user.department, "Computer Science")
        self.assertEqual(self.user.country, Country(code="US"))

    def test_user_str_method(self):
        """Test that the string representation of the user is the email."""
        self.assertEqual(str(self.user), "testuser@example.com")

    def test_blank_fields(self):
        """Test that fields can be left blank or set to null."""
        user_with_blank_fields = User.objects.create_user(
            username="blankuser",
            email="blankuser@example.com",
            password="testpassword123",
            first_name=None,
            last_name=None,
            university=None,
            department=None,
            country=None,
        )
        self.assertEqual(user_with_blank_fields.first_name, None)
        self.assertEqual(user_with_blank_fields.last_name, None)
        self.assertEqual(user_with_blank_fields.university, None)
        self.assertEqual(user_with_blank_fields.department, None)
        self.assertEqual(user_with_blank_fields.country, None)

    def test_country_field(self):
        """Test that the country field works correctly."""
        # Ensure the country field is correctly stored as a `Country` object
        self.assertIsInstance(self.user.country, Country)
        self.assertEqual(self.user.country.code, "US")
        self.assertEqual(self.user.country.name, "United States of America")
