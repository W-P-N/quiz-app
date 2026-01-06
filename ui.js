// DOM References:
const quizScreen = document.getElementById('quiz-screen');
const startScreen = document.getElementById('start-screen');
const resultsScreen = document.getElementById('results-screen');

// UI Functions:
export function showScreen(screenNumber) {
    switch (screenNumber) {
        case 0:
            // Show start screen only
            startScreen.classList.remove('hidden');
            quizScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            break;
        case 1:
            // Show quiz screen only
            startScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            resultsScreen.classList.add('hidden');
            break;
        case 2:
            // Show result screen only
            // resultsScreen.replaceChildren('');
            startScreen.classList.add('hidden');
            quizScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            break;
        default:
            startScreen.classList.remove('hidden');
            quizScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            break;
    }
    return;
};

export function displayTimer(counter) {
    let seconds = counter % 60;
    let minutes = Math.floor(counter / 60);
    minutesDisplay.textContent = minutes;
    secondsDisplay.textContent = seconds;
    return;
};

export function renderResults(state) {
    const correctlyAnswered = state.correctlyAnswered;
    const totalMarks = state.totalMarks;
    const questionsArray = state.questionsArray;

    resultsSection.replaceChildren('');
    const scoresDiv = document.createElement('div');
    const totalMarksHeading = document.createElement('h3');
    totalMarksHeading.textContent = `Total Marks: ${totalMarks}`;
    const correctlyAnsweredHeading = document.createElement('h3');
    correctlyAnsweredHeading.textContent = `Correctly Answered: ${correctlyAnswered}`;
    scoresDiv.appendChild(totalMarksHeading);
    scoresDiv.appendChild(correctlyAnsweredHeading);

    
    const questionAnswerDiv = document.createElement('div');
    for(let i=0; i<questionsArray.length; ++i) {
        const questionHeading = document.createElement('h4');
        const answerParagraph = document.createElement('p');
        questionHeading.textContent = `Question: ${questionsArray[i].question}`;
        const answer = questionsArray[i].answer;
        answerParagraph.textContent = `Solution: ${questionsArray[i].options[answer]}`;
        questionAnswerDiv.appendChild(questionHeading);
        questionAnswerDiv.appendChild(answerParagraph);
    };

    scoresDiv.appendChild(questionAnswerDiv);
    resultsSection.appendChild(scoresDiv);
    return;
};

export function displayQuestion(state) {
    // Question Display
    const currentQuestion = state.questionsArray[state.currentQuestionNumber];
    questionBlock.textContent = currentQuestion.question;

    optionsBlock.replaceChildren('');
    // Options Display
    Object.entries(currentQuestion.options).forEach(([key, value]) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option-div');
        
        const inputElement = document.createElement('input');
        inputElement.type = 'radio';
        inputElement.name = 'option';
        inputElement.id = key;
        inputElement.value = value;

        optionDiv.appendChild(inputElement);

        const optionLabel = document.createElement('label');
        optionLabel.htmlFor = key;
        optionLabel.textContent = value;

        optionDiv.appendChild(optionLabel);

        optionsBlock.appendChild(optionDiv);
    });
};

export function showError(errorText) {
    errorSpanText.textContent = errorText;
};

export function getSelectedAnswer() {
    return document.querySelector('input[name="option"]:checked');
};

// Exporting General UI references
export const startQuizButton = document.getElementById('start-game-button');
export const errorSpanText = document.getElementById('error');
export const submitAnswerButton = document.getElementById('submit-answer-button');
export const playAgainButton = document.getElementById('play-again-button');
export const homeButton = document.getElementById('home-button');

// Exporting Quiz Start Validation references
export const questionTimeSlider = document.getElementById('question-time');
export const sliderValue = document.getElementById('slider-value');
export const numQuestionsInput = document.getElementById('number-of-questions');

// Exporting Question Block references
export const questionBlock = document.getElementById('question-block');
export const optionsBlock = document.getElementById('options-block');

// Exporting Timer references
export const minutesDisplay = document.getElementById('minutes-display');
export const secondsDisplay = document.getElementById('seconds-display');

// Exporting Results references
export const resultsSection = document.getElementById('results');
