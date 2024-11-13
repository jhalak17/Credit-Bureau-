from django.contrib import admin

from .models import Question, UserResponse

class QuestionProfile(admin.ModelAdmin):
    list_display = ["id", "text"]

class UserResponseProfile(admin.ModelAdmin):
    list_display = ["question__text", "response"]

admin.site.register(Question, QuestionProfile)
admin.site.register(UserResponse, UserResponseProfile)