from django.db import models


# used to display a list of psychology models on the homepage
class HighlightedPsychologyModel(models.Model):
    psychology_model = models.ForeignKey(
        "psychology_models.PsychologyModel", on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.psychology_model.title


# used to list highlighted frameworks in the footer
class HighlightedFramework(models.Model):
    framework = models.ForeignKey(
        "psychology_models.Framework", on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.framework.name


# used to list highlighted disciplines in the footer
class HighlightedPsychologyDiscipline(models.Model):
    psychology_discipline = models.ForeignKey(
        "psychology_models.PsychologyDiscipline", on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.psychology_discipline.name


# used to list highlighted programming languages in the footer
class HighlightedProgrammingLanguage(models.Model):
    programming_language = models.ForeignKey(
        "psychology_models.ProgrammingLanguage",
        on_delete=models.CASCADE,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.programming_language.name
