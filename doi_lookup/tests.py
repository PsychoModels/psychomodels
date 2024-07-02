from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
import json


class LookupDOITestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_invalid_doi_format(self):
        response = self.client.get(reverse("lookup_doi", args=["invalid-doi"]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.content, b"Invalid DOI format")

    @patch("doi_lookup.views.CrossRefClient")
    def test_valid_doi(self, MockCrossRefClient):
        mock_response = "Kim, J., LaRose, R., & Peng, W. (2009). Loneliness as the Cause and the Effect of Problematic Internet Use: The Relationship between Internet Use and Psychological Well-Being. CyberPsychology &amp; Behavior, 12(4), 451–455. https://doi.org/10.1089/cpb.2008.0327"
        mock_client_instance = MockCrossRefClient.return_value
        mock_client_instance.doi2apa.return_value = mock_response

        response = self.client.get(reverse("lookup_doi", args=["10.1000/xyz123"]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), mock_response)

    @patch("doi_lookup.views.CrossRefClient")
    def test_doi_lookup_exception(self, MockCrossRefClient):
        mock_client_instance = MockCrossRefClient.return_value
        mock_client_instance.doi2apa.side_effect = Exception("Some error")

        response = self.client.get(reverse("lookup_doi", args=["10.1000/xyz123"]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.content, b"Error fetching DOI information: Some error"
        )
