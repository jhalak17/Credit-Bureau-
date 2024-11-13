from django.urls import path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path('', TemplateView.as_view(template_name='questions.html'), name = "homepage"),
    path('get-questions/', views.get_questions,),
    path('submit-answers/', views.submit_answers),
    path('get-credit-score/', views.get_credit_score),
]