from django.test import TestCase
from unittest.mock import patch, MagicMock
import requests
from django.contrib import messages as django_messages

from psychology_models.models import PsychologyModel
from psychology_models.utils.get_doi_citations import fetch_and_save, get_doi_citations


class DOILookupTest(TestCase):
    def setUp(self):
        # Create a test instance of PsychologyModel with a DOI
        self.model_instance = PsychologyModel.objects.create(
            title="Test Model",
            publication_doi="10.1234/test-doi",
        )
        self.invalid_model_instance = PsychologyModel.objects.create(
            title="Invalid Model",
            publication_doi="invalid-doi",
        )

    @patch("psychology_models.utils.get_doi_citations.CrossRefClient.doi2apa")
    @patch("psychology_models.utils.get_doi_citations.CrossRefClient.doi2json")
    def test_fetch_and_save_success(self, mock_doi2json, mock_doi2apa):
        # Mock the responses from CrossRefClient
        mock_doi2apa.return_value = "APA Citation"
        mock_doi2json.return_value = {"title": "Test JSON"}

        # Call fetch_and_save for "publication_citation"
        messages = fetch_and_save(
            self.model_instance,
            fetch_function=mock_doi2apa,
            attribute_name="publication_citation",
            fetched_at_name="publication_citation_fetched_at",
            refetch=True,
        )

        # Ensure the model is updated
        self.model_instance.refresh_from_db()
        self.assertEqual(self.model_instance.publication_citation, "APA Citation")

        # Ensure the correct success message is returned
        self.assertEqual(len(messages), 1)
        self.assertIn("fetched publication_citation for DOI", messages[0][0])
        self.assertEqual(messages[0][1], django_messages.SUCCESS)

    @patch("doi_lookup.views.CrossRefClient.doi2apa")
    def test_fetch_and_save_404_error(self, mock_doi2apa):
        # Simulate an HTTP 404 error from CrossRefClient
        mock_doi2apa.side_effect = requests.exceptions.HTTPError(
            response=MagicMock(status_code=404)
        )

        # Call fetch_and_save with the 404 error
        messages = fetch_and_save(
            self.model_instance,
            fetch_function=mock_doi2apa,
            attribute_name="publication_citation",
            fetched_at_name="publication_citation_fetched_at",
            refetch=True,
        )

        # Ensure no changes were made to the model
        self.model_instance.refresh_from_db()
        self.assertIsNone(self.model_instance.publication_citation_fetched_at)

        # Ensure the correct error message is returned
        self.assertEqual(len(messages), 1)
        self.assertIn("publication_citation for DOI", messages[0][0])
        self.assertEqual(messages[0][1], django_messages.ERROR)

    @patch("doi_lookup.views.CrossRefClient.doi2apa")
    def test_fetch_and_save_generic_error(self, mock_doi2apa):
        # Simulate a generic error (non-404)
        mock_doi2apa.side_effect = Exception("Some error")

        # Call fetch_and_save with a generic error
        messages = fetch_and_save(
            self.model_instance,
            fetch_function=mock_doi2apa,
            attribute_name="publication_citation",
            fetched_at_name="publication_citation_fetched_at",
            refetch=True,
        )

        # Ensure no changes were made to the model
        self.model_instance.refresh_from_db()
        self.assertIsNone(self.model_instance.publication_citation_fetched_at)

        # Ensure the correct generic error message is returned
        self.assertEqual(len(messages), 1)
        self.assertIn("error fetching publication_citation", messages[0][0])
        self.assertEqual(messages[0][1], django_messages.ERROR)

    @patch("psychology_models.utils.get_doi_citations.fetch_and_save")
    def test_get_doi_citations(self, mock_fetch_and_save):
        # Mock the fetch_and_save function to track calls
        mock_fetch_and_save.return_value = [("Success", django_messages.SUCCESS)]

        # Call get_doi_citations with a valid queryset
        queryset = PsychologyModel.objects.filter(publication_doi__isnull=False)
        messages = get_doi_citations(queryset, refetch=True)

        # Ensure fetch_and_save was called twice (for APA and JSON)
        self.assertEqual(mock_fetch_and_save.call_count, 2)

        # Ensure the correct success message is returned
        self.assertEqual(len(messages), 3)
        self.assertIn("Success", messages[0][0])

    def test_get_doi_citations_invalid_doi(self):
        # Call get_doi_citations with an invalid DOI
        queryset = PsychologyModel.objects.filter(id=self.invalid_model_instance.id)
        messages = get_doi_citations(queryset, refetch=True)

        # Ensure an error message is returned for invalid DOI
        self.assertEqual(len(messages), 1)
        self.assertIn("Invalid DOI", messages[0][0])
        self.assertEqual(messages[0][1], django_messages.ERROR)
