import * as UI from "./ui.js";
import * as Data from "./data.js";
import { SCREENS } from "./screens.js";

// Quiz functions
function startTimer(state) {
    state.counter = parseInt(UI.questionTimeSlider.value) * 60;

    state.timeInterval = setInterval(function() {
        state.counter-=1;
        UI.displayTimer(state.counter);
        if(state.counter <= 0) {
            processAnswer(state)
        };
    }, 1000);
};

function showNextQuestion(state) {
    if(state.currentQuestionNumber >= state.totalQuestions) {
        UI.renderResults(state);
        // Show results screen - 2
        UI.showScreen(SCREENS.RESULTS);
        return;
    };
    UI.displayQuestion(state);
    startTimer(state);
};

export function processAnswer(state) {
    clearInterval(state.timeInterval);

    const selectedAnswer = UI.getSelectedAnswer();
    if(selectedAnswer) {
        if(selectedAnswer.id === state.questionsArray[state.currentQuestionNumber]) {
            state.totalMarks += 2;
            state.correctlyAnswered += 1;
        } else {
            state.totalMarks -= 1;
        };
    };
    state.currentQuestionNumber++;
    showNextQuestion(state);
};

export async function start(state) {
    const numQuestions = parseInt(UI.numQuestionsInput.value);
    const min = parseInt(UI.numQuestionsInput.min);
    const max = parseInt(UI.numQuestionsInput.max);

    if(!numQuestions || numQuestions < min || numQuestions > max) {
        UI.showError(`Please select between ${min} and ${max} questions.`);
        return;
    };
    
    UI.showError("");

    if(state.data.length == 0) {
        try {
            state.data = await Data.fetchData();
        } catch (error) {
            UI.showError('Unable to fetch questions. Please try again later!');
            return;
        }
    };

    Data.shuffleData(state.data);
    state.questionsArray = state.data.slice(0, numQuestions);
    state.currentQuestionNumber = 0;
    state.totalQuestions = numQuestions;
    UI.showScreen(SCREENS.QUIZ);
    showNextQuestion(state);
};

