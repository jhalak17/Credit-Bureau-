import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Question, UserResponse

ANSWER_SCORES = {
    'Always': 30,
    'Sometimes': 20,
    'Rarely': 10,
    'Never': 0
}

def get_questions(request):
    questions = Question.objects.all()
    data = list(questions.values('id', 'text'))
    return JsonResponse({'questions': data})

@csrf_exempt
def submit_answers(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        answers = data.get('answers')

        for answer in answers:
            question_id = answer.get('question_id')
            answer = answer.get('answer')

            user_response = UserResponse.objects.filter(question__id = question_id).update(response=answer)

            if not user_response:
                UserResponse.objects.create(
                    user=request.user,
                    question_id=question_id,
                    response=answer
                )

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

def get_credit_score(request):
    user_responses = UserResponse.objects.filter(user=request.user)
    score = 0
    for user_response in user_responses:
        score += ANSWER_SCORES.get(user_response.response, 0)
    return render(request, 'credit_score.html', {"score":score})
