from datetime import date
from django.db import models

# Create your models here.
class Question(models.Model):
    text = models.CharField(max_length=255)

class UserResponse(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    response = models.CharField(max_length=10)
