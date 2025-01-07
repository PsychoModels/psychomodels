from rest_framework import serializers

from contact.models import ContactMessage
from psychology_models.models import (
    PsychologyModel,
    Framework,
    SoftwarePackage,
    PsychologyDiscipline,
    Variable,
    ModelVariable,
    ProgrammingLanguage,
    PsychologyModelDraft,
)
from members.models import User
from django_countries.serializers import CountryFieldMixin


class PsychologyDisciplineSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False)

    def validate(self, data):
        id_provided = "id" in data and data["id"] is not None
        name_provided = "name" in data and data["name"] is not None

        if id_provided and name_provided:
            raise serializers.ValidationError(
                "Provide either 'id' or 'name', but not both."
            )

        if not id_provided and not name_provided:
            raise serializers.ValidationError(
                "You must provide either 'id' to look up an existing discipline or 'name' to create a new one."
            )

        return data

    def create(self, validated_data):
        if "id" in validated_data:
            # Handle case where 'id' is provided, look up the existing discipline
            try:
                discipline = PsychologyDiscipline.objects.get(id=validated_data["id"])
            except PsychologyDiscipline.DoesNotExist:
                raise serializers.ValidationError(
                    f"PsychologyDiscipline with id {validated_data['id']} does not exist."
                )
            return discipline
        else:
            # Handle case where 'name' is provided, create a new discipline
            discipline, created = PsychologyDiscipline.objects.get_or_create(
                name=validated_data["name"]
            )
            return discipline


class ProgrammingLanguageSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False)

    def validate(self, data):
        id_provided = "id" in data and data["id"] is not None
        name_provided = "name" in data and data["name"] is not None

        if id_provided and name_provided:
            raise serializers.ValidationError(
                "Provide either 'id' or 'name', but not both."
            )

        if not id_provided and not name_provided:
            raise serializers.ValidationError(
                "You must provide either 'id' to look up an existing programing language or 'name' to create a new one."
            )

        return data

    def create(self, validated_data):
        if "id" in validated_data:
            # Handle case where 'id' is provided, look up the existing programing language
            try:
                language = ProgrammingLanguage.objects.get(id=validated_data["id"])
            except ProgrammingLanguage.DoesNotExist:
                raise serializers.ValidationError(
                    f"ProgrammingLanguage with id {validated_data['id']} does not exist."
                )
            return language
        else:
            # Handle case where 'name' is provided, create a new programing language
            language, created = ProgrammingLanguage.objects.get_or_create(
                name=validated_data["name"]
            )
            return language


class FrameworkSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    explanation = serializers.CharField(required=False)
    publication_doi = serializers.CharField(required=False, allow_null=True)
    documentation_url = serializers.CharField(required=False, allow_null=True)

    def validate(self, data):
        id_provided = "id" in data and data["id"] is not None
        name_provided = "name" in data and data["name"] is not None
        description_provided = "description" in data and data["description"] is not None
        explanation_provided = "explanation" in data and data["explanation"] is not None

        if id_provided and (
            name_provided or description_provided or explanation_provided
        ):
            raise serializers.ValidationError(
                "Provide either 'id' or 'name/description/explanation', but not both."
            )

        if not id_provided and not (
            name_provided and description_provided and explanation_provided
        ):
            raise serializers.ValidationError(
                "You must provide either 'id' to look up an look up an existing framework or 'name/description/explanation' to create a new one."
            )

        return data

    def create(self, validated_data):
        if "id" in validated_data:
            try:
                framework = Framework.objects.get(id=validated_data["id"])
            except Framework.DoesNotExist:
                raise serializers.ValidationError(
                    f"Framework with id {validated_data['id']} does not exist."
                )
            return framework
        else:
            # Handle case where 'name' is provided, create a new programing language
            framework = Framework(
                name=validated_data["name"],
                description=validated_data["description"],
                explanation=validated_data["explanation"],
                publication_doi=validated_data.get("publication_doi", ""),
                documentation_url=validated_data.get("documentation_url", ""),
            )
            framework.save()
            return framework


class VariableSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)

    def validate(self, data):
        id_provided = "id" in data and data["id"] is not None
        name_provided = "name" in data and data["name"] is not None
        description_provided = "description" in data and data["description"] is not None

        if id_provided and (name_provided or description_provided):
            raise serializers.ValidationError(
                "Provide either 'id' or 'name/description', but not both."
            )

        if not id_provided and not (name_provided and description_provided):
            raise serializers.ValidationError(
                "You must provide either 'id' to look up an look up an existing variable or 'name/description' to create a new one."
            )

        return data

    def create(self, validated_data):
        if "id" in validated_data:
            try:
                variable = Variable.objects.get(id=validated_data["id"])
            except Variable.DoesNotExist:
                raise serializers.ValidationError(
                    f"Variable with id {validated_data['id']} does not exist."
                )
            return variable
        else:
            # Handle case where 'name' is provided, create a new variable
            variable = Variable(
                name=validated_data["name"],
                description=validated_data["description"],
            )
            variable.save()
            return variable


class ModelVariableSerializer(serializers.ModelSerializer):
    variable = VariableSerializer(required=False)

    class Meta:
        model = ModelVariable
        fields = ["name", "details", "variable"]

    def create(self, validated_data):
        variable_data = validated_data.pop("variable", None)

        model_variable = ModelVariable(**validated_data)

        variable_serializer = VariableSerializer(data=variable_data)
        variable_serializer.is_valid(raise_exception=True)
        variable = variable_serializer.save()
        model_variable.variable = variable

        model_variable.save()
        return model_variable


class SoftwarePackageSerializer(serializers.ModelSerializer):
    programming_language = ProgrammingLanguageSerializer(
        required=False, allow_null=True
    )

    class Meta:
        model = SoftwarePackage
        fields = [
            "name",
            "description",
            "documentation_url",
            "code_repository_url",
            "programming_language",
        ]

    def create(self, validated_data):
        programming_language_data = validated_data.pop("programming_language", None)

        software_package = SoftwarePackage(**validated_data)

        if programming_language_data:
            programming_language_serializer = ProgrammingLanguageSerializer(
                data=programming_language_data
            )
            programming_language_serializer.is_valid(raise_exception=True)
            programing_language = programming_language_serializer.save()
            software_package.programming_language = programing_language

        software_package.save()
        return software_package


class PsychologyModelSerializer(serializers.ModelSerializer):
    framework = FrameworkSerializer(many=True, required=False)
    programming_language = ProgrammingLanguageSerializer(
        required=False, allow_null=True
    )
    software_package = SoftwarePackageSerializer(many=True, required=False)
    psychology_discipline = PsychologyDisciplineSerializer(many=True, required=False)
    model_variable = ModelVariableSerializer(many=True, required=False)

    class Meta:
        model = PsychologyModel
        fields = [
            "id",
            "title",
            "description",
            "explanation",
            "publication_doi",
            "programming_language",
            "framework",
            "software_package",
            "psychology_discipline",
            "model_variable",
            "code_repository_url",
            "data_url",
            "submission_remarks",
        ]

    def create(self, validated_data):
        frameworks_data = validated_data.pop("framework", [])
        software_packages_data = validated_data.pop("software_package", [])
        disciplines_data = validated_data.pop("psychology_discipline", [])
        model_variables_data = validated_data.pop("model_variable", [])
        programming_language_data = validated_data.pop("programming_language", None)

        psychology_model = PsychologyModel.objects.create(**validated_data)

        for discipline_data in disciplines_data:
            discipline_serializer = PsychologyDisciplineSerializer(data=discipline_data)
            discipline_serializer.is_valid(raise_exception=True)
            discipline = discipline_serializer.save()
            psychology_model.psychology_discipline.add(discipline)

        if programming_language_data:
            programming_language_serializer = ProgrammingLanguageSerializer(
                data=programming_language_data
            )
            programming_language_serializer.is_valid(raise_exception=True)
            programing_language = programming_language_serializer.save()
            psychology_model.programming_language = programing_language

        for software_package_data in software_packages_data:
            software_package_serializer = SoftwarePackageSerializer(
                data=software_package_data
            )
            software_package_serializer.is_valid(raise_exception=True)
            software_package = software_package_serializer.save()
            psychology_model.software_package.add(software_package)

        for framework_data in frameworks_data:
            framework_serializer = FrameworkSerializer(data=framework_data)
            framework_serializer.is_valid(raise_exception=True)
            framework = framework_serializer.save()
            psychology_model.framework.add(framework)

        for model_variable_data in model_variables_data:
            model_variable_serializer = ModelVariableSerializer(
                data=model_variable_data
            )
            model_variable_serializer.is_valid(raise_exception=True)
            model_variable = model_variable_serializer.save()
            psychology_model.model_variable.add(model_variable)

        psychology_model.save()
        return psychology_model


class UserProfileSerializer(CountryFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "university",
            "department",
            "position",
            "country",
        ]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["email", "subject", "message"]


class PsychologyModelDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = PsychologyModelDraft
        fields = ["data", "id"]

    def validate_data(self, value):
        if not isinstance(value, dict):  # Ensure it's a JSON object (dictionary)
            raise serializers.ValidationError(
                "The 'data' field must be a valid JSON object."
            )
        return value
