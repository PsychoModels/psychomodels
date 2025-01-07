from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from members.models import User
from psychology_models.models import (
    PsychologyModel,
    ProgrammingLanguage,
    PsychologyDiscipline,
    Framework,
    Variable,
    PsychologyModelDraft,
)


class PsychologyModelAPITest(APITestCase):
    def setUp(self):
        # Create an existing related models
        self.existing_programming_language = ProgrammingLanguage.objects.create(
            name="Python",
        )

        self.existing_psychology_discipline = PsychologyDiscipline.objects.create(
            name="Clinical Psychology"
        )

        self.existing_psychology_discipline2 = PsychologyDiscipline.objects.create(
            name="Cognitive Psychology"
        )

        self.existing_framework = Framework.objects.create(
            name="Network Models",
            description="description",
            explanation="explanation",
        )

        self.existing_variable = Variable.objects.create(
            name="Task Difficulty",
            description="The level of challenge presented by a task.",
        )

        # Define the URL for the PsychologyModel list endpoint
        self.url = reverse("psychology_models_create")

        # Create a test user
        self.user = User.objects.create_user(
            username="testuser", password="testpassword", email="testuser@example.com"
        )

        self.user2 = User.objects.create_user(
            username="otheruser",
            password="otherpassword",
            email="otheruser@example.com",
        )

        # Create a draft
        self.draft = PsychologyModelDraft.objects.create(
            data="{}",
            created_by=self.user,
        )

    def test_create_psychology_model_without_login(self):
        """
        Ensure that unauthenticated requests are rejected.
        """
        payload = {
            "title": "Psychology Model #1",
            "description": "A detailed description of the advanced psychology model.",
            "explanation": "## Detailed Markdown explanation",
        }

        # Send POST request without authentication
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_psychology_model_with_only_required_fields(self):
        payload = {
            "title": "Psychology Model #1",
            "description": "A detailed description of the advanced psychology model.",
            "explanation": "## Detailed Markdown explanation",
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #1")
        self.assertEqual(psychology_model.description, payload["description"])
        self.assertEqual(psychology_model.explanation, payload["explanation"])

    def test_create_psychology_model_with_psychology_discipline(self):
        # use an existing discipline by id, by name and add a new one
        payload = {
            "title": "Psychology Model #2",
            "description": "description",
            "explanation": "explanation",
            "psychology_discipline": [
                {"id": self.existing_psychology_discipline.id},
                {"name": "Social Psychology"},
                {"name": self.existing_psychology_discipline2.name},
            ],
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #2")

        self.assertEqual(psychology_model.created_by, self.user)

        discipline_names = [
            discipline.name
            for discipline in psychology_model.psychology_discipline.all()
        ]
        self.assertIn("Clinical Psychology", discipline_names)
        self.assertIn("Cognitive Psychology", discipline_names)
        self.assertIn("Social Psychology", discipline_names)

    def test_create_psychology_model_raise_validation_error_non_existing_psychology_discipline(
        self,
    ):
        # use an existing discipline by id, by name and add a new one
        payload = {
            "title": "Advanced Psychology Model",
            "description": "description",
            "explanation": "explanation",
            "psychology_discipline": [
                {"id": 9999},
            ],
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.content, b'["PsychologyDiscipline with id 9999 does not exist."]'
        )

    def test_create_psychology_model_with_existing_programming_language(self):
        payload = {
            "title": "Psychology Model #8",
            "description": "description",
            "explanation": "explanation",
            "programming_language": {"id": self.existing_programming_language.id},
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #8")

        self.assertEqual(psychology_model.programming_language.name, "Python")

    def test_create_psychology_model_with_new_programming_language(self):
        payload = {
            "title": "Psychology Model #7",
            "description": "description",
            "explanation": "explanation",
            "programming_language": {"name": "R"},
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #7")

        self.assertEqual(psychology_model.programming_language.name, "R")

    def test_create_psychology_model_raise_validation_error_non_existing_programming_language(
        self,
    ):
        # use an existing discipline by id, by name and add a new one
        payload = {
            "title": "Advanced Psychology Model",
            "description": "description",
            "explanation": "explanation",
            "programming_language": {"id": 9999},
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.content, b'["ProgrammingLanguage with id 9999 does not exist."]'
        )

    def test_create_psychology_model_with_software_package(
        self,
    ):
        payload = {
            "title": "Psychology Model #6",
            "description": "description",
            "explanation": "explanation",
            "software_package": [
                {
                    "name": "Django",
                    "documentation_url": "https://docs.djangoproject.com/en/5.1/",
                    "code_repository_url": "https://github.com/django/django",
                    "description": "The Django web framework is a high-level Python web framework",
                    "programming_language": {"name": "Python"},
                }
            ],
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #6")

        self.assertEqual(psychology_model.software_package.count(), 1)
        software_package = psychology_model.software_package.first()

        # Assert that the software package fields match the payload
        self.assertEqual(software_package.name, "Django")
        self.assertEqual(
            software_package.documentation_url,
            "https://docs.djangoproject.com/en/5.1/",
        )
        self.assertEqual(
            software_package.code_repository_url, "https://github.com/django/django"
        )
        self.assertEqual(
            software_package.description,
            "The Django web framework is a high-level Python web framework",
        )
        self.assertEqual(
            software_package.programming_language.name,
            "Python",
        )

    def test_create_psychology_model_with_new_framework(
        self,
    ):
        payload = {
            "title": "Psychology Model #5",
            "description": "description",
            "explanation": "explanation",
            "framework": [
                {
                    "name": "Memory Models",
                    "description": "description",
                    "explanation": "explanation",
                }
            ],
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #5")

        self.assertEqual(psychology_model.framework.count(), 1)
        framework = psychology_model.framework.first()

        # Assert that the software package fields match the payload
        self.assertEqual(framework.name, "Memory Models")
        self.assertEqual(
            framework.description,
            "description",
        )
        self.assertEqual(framework.explanation, "explanation")

    def test_create_psychology_model_with_existing_framework(
        self,
    ):
        payload = {
            "title": "Psychology Model #4",
            "description": "description",
            "explanation": "explanation",
            "framework": [
                {
                    "id": self.existing_framework.id,
                }
            ],
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #4")

        self.assertEqual(psychology_model.framework.count(), 1)
        framework = psychology_model.framework.first()

        # Assert that the software package fields match the payload
        self.assertEqual(framework.name, "Network Models")
        self.assertEqual(framework.id, self.existing_framework.id)

    def test_create_psychology_model_with_existing_variable(
        self,
    ):
        payload = {
            "title": "Psychology Model #10",
            "description": "description",
            "explanation": "explanation",
            "model_variable": [
                {
                    "name": "X",
                    "details": "Details",
                    "variable": {"id": self.existing_variable.id},
                }
            ],
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #10")

        self.assertEqual(psychology_model.model_variable.count(), 1)
        model_variable = psychology_model.model_variable.first()

        # Assert that the software package fields match the payload
        self.assertEqual(model_variable.name, "X")
        self.assertEqual(model_variable.details, "Details")
        self.assertEqual(model_variable.variable.id, self.existing_framework.id)

    def test_create_psychology_model_with_new_variable(
        self,
    ):
        payload = {
            "title": "Psychology Model #10",
            "description": "description",
            "explanation": "explanation",
            "model_variable": [
                {
                    "name": "X",
                    "details": "Details",
                    "variable": {"name": "Stress", "description": "desc"},
                }
            ],
        }

        # Log in the test user
        self.client.login(username="testuser", password="testpassword")

        # Send POST request to create the PsychologyModel
        response = self.client.post(self.url, payload, format="json")

        # Check that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the created PsychologyModel from the database
        psychology_model = PsychologyModel.objects.get(title="Psychology Model #10")

        self.assertEqual(psychology_model.model_variable.count(), 1)
        model_variable = psychology_model.model_variable.first()

        # Assert that the software package fields match the payload
        self.assertEqual(model_variable.name, "X")
        self.assertEqual(model_variable.details, "Details")
        self.assertEqual(model_variable.variable.name, "Stress")
        self.assertEqual(model_variable.variable.description, "desc")

    def test_list_drafts_authenticated(self):
        self.client.login(username="testuser", password="testpassword")
        url = "/api/psychology_models/draft/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_drafts_unauthenticated(self):
        url = "/api/psychology_models/draft/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_draft_authenticated(self):
        self.client.login(username="testuser", password="testpassword")
        url = f"/api/psychology_models/draft/{self.draft.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_draft_unauthenticated(self):
        url = f"/api/psychology_models/draft/{self.draft.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_draft_not_owned(self):
        self.client.login(username="otheruser", password="otherpassword")
        url = f"/api/psychology_models/draft/{self.draft.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_draft_authenticated(self):
        self.client.login(username="testuser", password="testpassword")
        url = "/api/psychology_models/draft/"
        payload = {
            "data": {},
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_draft_unauthenticated(self):
        url = "/api/psychology_models/draft/"
        payload = {
            "data": {},
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_draft_authenticated(self):
        self.client.login(username="testuser", password="testpassword")
        url = f"/api/psychology_models/draft/{self.draft.id}/"
        payload = {
            "data": {},
        }
        response = self.client.put(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_draft_not_owned(self):
        self.client.login(username="otheruser", password="otherpassword")
        url = f"/api/psychology_models/draft/{self.draft.id}/"
        payload = {
            "data": {},
        }
        response = self.client.put(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_draft_authenticated(self):
        self.client.login(username="testuser", password="testpassword")
        url = f"/api/psychology_models/draft/{self.draft.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(PsychologyModelDraft.objects.filter(id=self.draft.id).exists())

    def test_delete_draft_not_owned(self):
        self.client.login(username="otheruser", password="otherpassword")
        url = f"/api/psychology_models/draft/{self.draft.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)