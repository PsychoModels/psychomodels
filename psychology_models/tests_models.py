from django.test import TestCase
from markdownx.utils import markdownify

from members.models import User
from .models import (
    ProgrammingLanguage,
    Framework,
    PsychologyDiscipline,
    Variable,
    PsychologyModel,
)


class ProgrammingLanguageModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser", password="testpassword")

    def test_create_programming_language(self):
        language = ProgrammingLanguage.objects.create(
            name="Python",
            created_by=self.user,
        )
        self.assertEqual(str(language), "Python")
        self.assertEqual(language.created_by, self.user)


class FrameworkModelTest(TestCase):
    def setUp(self):
        self.framework = Framework.objects.create(
            name="Ordinary Differential Equations",
            description="A framework for modeling the change in variables over time using differential equations.",
            explanation="This is **markdown** text",
        )

    def test_framework_creation(self):
        self.assertEqual(str(self.framework), "Ordinary Differential Equations")
        self.assertEqual(
            self.framework.description,
            "A framework for modeling the change in variables over time using differential equations.",
        )

    def test_slug_generation(self):
        self.assertIsNotNone(self.framework.slug)
        self.assertEqual(self.framework.slug, "ordinary-differential-equations")

    def test_formatted_explanation(self):
        expected_html = markdownify(self.framework.explanation)
        self.assertEqual(self.framework.formatted_explanation, expected_html)


from django.test import TestCase
from .models import SoftwarePackage, ProgrammingLanguage


class SoftwarePackageModelTest(TestCase):
    def setUp(self):
        self.language = ProgrammingLanguage.objects.create(name="Python")
        self.package = SoftwarePackage.objects.create(
            name="Django",
            description="A Python-based web framework",
            programming_language=self.language,
        )

    def test_software_package_creation(self):
        self.assertEqual(str(self.package), "Django")
        self.assertEqual(self.package.programming_language, self.language)
        self.assertEqual(self.package.description, "A Python-based web framework")


class PsychologyDisciplineModelTest(TestCase):
    def setUp(self):
        self.discipline = PsychologyDiscipline.objects.create(
            name="Cognitive Psychology"
        )

    def test_psychology_discipline_creation(self):
        self.assertEqual(str(self.discipline), "Cognitive Psychology")


class VariableModelTest(TestCase):
    def setUp(self):
        self.variable = Variable.objects.create(name="Test Variable")

    def test_variable_creation(self):
        self.assertEqual(str(self.variable), "Test Variable")


class PsychologyModelTest(TestCase):
    def setUp(self):
        self.language = ProgrammingLanguage.objects.create(name="Python")
        self.framework1 = Framework.objects.create(name="Cusp-Catastrophe Models")
        self.framework2 = Framework.objects.create(name="Drift-Diffusion Models")
        self.psychology_model = PsychologyModel.objects.create(
            title="Test Model",
            description="This is a test description",
            programming_language=self.language,
        )
        self.psychology_model.framework.set([self.framework1, self.framework2])

    def test_psychology_model_creation(self):
        self.assertEqual(str(self.psychology_model), "Test Model")
        self.assertEqual(
            self.psychology_model.description, "This is a test description"
        )
        self.assertEqual(self.psychology_model.programming_language, self.language)

    def test_framework_names_method(self):
        framework_names = self.psychology_model.framework_names()
        self.assertEqual(
            framework_names, ["Cusp-Catastrophe Models", "Drift-Diffusion Models"]
        )

    def test_programming_language_name_method(self):
        self.assertEqual(self.psychology_model.programming_language_name(), "Python")

    def test_get_absolute_url(self):
        self.assertEqual(
            self.psychology_model.get_absolute_url(),
            f"/models/{self.psychology_model.slug}/",
        )
