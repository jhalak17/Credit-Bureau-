document.getElementById('startBtn').addEventListener('click', function() {
    fetchQuestions();
});

let currentQuestionIndex = 0;
let questions = [];
let answers = [];

function fetchQuestions() {
    fetch('/get-questions/')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            currentQuestionIndex = 0;
            answers = [];
            showQuestionPopup();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function showQuestionPopup() {
    if (currentQuestionIndex >= questions.length) {
        closePopup();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('questionContainer').innerHTML = `
        <p>${question.text}</p>
        <div class="options">
            <label><input type="radio" name="answer" value="Always"> Always</label>
            <label><input type="radio" name="answer" value="Sometimes"> Sometimes</label>
            <label><input type="radio" name="answer" value="Rarely"> Rarely</label>
            <label><input type="radio" name="answer" value="Never"> Never</label>
        </div>
    `;

    // Hide the submit button on intermediate questions
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

document.getElementById('nextBtn').addEventListener('click', function() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer!');
        return;
    }

    answers.push({
        question_id: questions[currentQuestionIndex].id,
        answer: selectedAnswer.value
    });

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestionPopup();  // Show the next question
    } else {
        showSubmitButton();  // Show the submit button after the last question
    }
});

function showSubmitButton() {
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'block';
}

document.getElementById('submitBtn').addEventListener('click', function() {
    submitAnswers();
});

function submitAnswers() {
    fetch('/submit-answers/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Ensure CSRF token is sent
        },
        body: JSON.stringify({ answers: answers })
    })
    .then(data => {
        window.location.href = '/get-credit-score/';
        closePopup();
    })
    .catch(error => {
        console.error('Error submitting answers:', error);
    });
}

function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}