import * as UI from "./ui.js";
import * as Quiz from "./quiz.js";

(function() {

    // State Management
    const state = {
        counter: 0,
        timeInterval: null,
        totalQuestions: 0,
        questionsArray: [],
        currentQuestionNumber: 0,
        correctlyAnswered: 0,
        totalMarks: 0,
        questionWiseJustifications: [],
        data: []
    };

    function stateReset() {
        // Function resets all the state variables to initial values.
        state.counter = 0;
        state.timeInterval = null;
        state.totalQuestions = 0;
        state.questionsArray = [];
        state.currentQuestionNumber = 0;
        state.correctlyAnswered = 0;
        state.totalMarks = 0;
        state.questionWiseJustifications = [];
        state.data = [];
        return;
    };

    function stateView() {
        // Debug function to view state at certain point in code - Logs state vars in console when called.
        console.log(state.counter);
        console.log(state.timeInterval);
        console.log(state.totalQuestions);
        console.log(state.questionsArray);
        console.log(state.currentQuestionNumber);
        console.log(state.correctlyAnswered);
        console.log(state.totalMarks);
        console.log(state.questionWiseJustifications);
        console.log(state.data);
        return;
    };

    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        //// Slider Value display after the content for the DOM is loaded
        UI.sliderValue.textContent = UI.questionTimeSlider.value;
    });
    UI.questionTimeSlider.addEventListener('input', function() {
        //// Listener that listens to change in slider value
        UI.sliderValue.textContent = this.value;
    });
    UI.playAgainButton.addEventListener('click', function() {
        // debugger;
        // stateView();
        stateReset();
        // stateView();
        Quiz.start(state);
    });
    UI.homeButton.addEventListener('click', function() {
        // debugger;
        // stateView();
        stateReset();
        // stateView();
        UI.showScreen(0);  
    });

    UI.submitAnswerButton.addEventListener('click', function() {
        Quiz.processAnswer(state);
    });

    UI.startQuizButton.addEventListener('click', function(e) {
        e.preventDefault();
        Quiz.start(state);
    });

}) ();
