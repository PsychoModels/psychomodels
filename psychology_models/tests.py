from django.test import TestCase
from django.urls import reverse


class DummyViewTestCase(TestCase):
    def test_dummy_view(self):
        response = self.client.get(reverse("models_about"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Summary / Mission")
