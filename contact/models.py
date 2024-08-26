from django.db import models


class ContactMessage(models.Model):
    email = models.CharField()
    subject = models.CharField()
    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.subject
