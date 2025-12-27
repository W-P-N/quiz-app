(function () {
    // State Management
    const state = {
        counter: 0,
        timeInterval: null,
        totalQuestions: 0,
        questionsArray: [],
        answersArray: [],
        currentQuestionNumber: 0,
        correctlyAnswered: 0,
        totalMarks: 0,
        questionWiseJustifications: [],
        data: []
    };

    function stateReset() {
        state.counter = 0;
        state.timeInterval = null;
        state.totalQuestions = 0;
        state.questionsArray = [];
        state.currentQuestionNumber = 0;
        state.correctlyAnswered = 0;
        state.totalMarks = 0;
        state.questionWiseJustifications = [];
        state.answersArray = [];
        state.data = [];
    };

    // Data
    function shuffleData() {
        const dataLen = state.data.length;
        for(let i=dataLen - 1; i>1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [state.data[i], state.data[j]] = [state.data[j], state.data[i]];
        };
        return;
    };

    // UI
    function showScreen(screenNumber) {
        const quizScreen = document.getElementById('quiz-screen');
        const startScreen = document.getElementById('start-screen');
        const resultsScreen = document.getElementById('results-screen');

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

    // Quiz Logic

    //// Get DOM references
    const questionTimeSlider = document.getElementById('question-time');
    const sliderValue = document.getElementById('slider-value');
    const startQuizButton = document.getElementById('start-game-button');
    const errorSpanText = document.getElementById('error');
    const submitAnswerButton = document.getElementById('submit-answer-button');

    //// Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        //// Slider Value display after the content for the DOM is loaded
        sliderValue.textContent = questionTimeSlider.value;
    });
    questionTimeSlider.addEventListener('input', function() {
        //// Listener that listens to change in slider value
        sliderValue.textContent = this.value;
    });
    //// Event Listener when user submits the answer
    submitAnswerButton.addEventListener('click', function() {
        clearInterval(state.timeInterval);
        onQuestionEnd();
    });
    //// Button to start quiz
    startQuizButton.addEventListener('click', async function(e) {
        e.preventDefault();
        errorSpanText.textContent = "";
        try {
            // Get Data
            const response = await fetch('./data.json');
            if (!response.ok) {
                throw new Error('Failed to load quiz data.');
            };
            state.data = await response.json();
            // Validate the quiz parameters
            validateStartQuiz();
            // On safe validation, fetch questions
            getRandomQuestions();
            // Show Quiz screen - Screen Number 1
            showScreen(1);
            // Start Quiz
            showNextQuestion();
        } catch (error) {
            errorSpanText.textContent = error;
            stateReset();
        };
    });
    //// Functions
    function validateStartQuiz() {
        // Get Input
        const numQuestionsInput = document.getElementById('number-of-questions');
        // Update state
        state.totalQuestions = numQuestionsInput.value;
        // Get min and max values
        const minNumQuestions = numQuestionsInput.min;
        const maxNumQuestions = numQuestionsInput.max;
        // Check
        if(!state.totalQuestions || state.totalQuestions < minNumQuestions || state.totalQuestions > maxNumQuestions) {
            throw new Error(`Please select minimum ${minNumQuestions} and maximum ${maxNumQuestions} as number of questions.`)
        };
        // console.log(numberOfQuestions.value, questionTimeSlider.value)  // Debug Log
        return;
    };
    function getRandomQuestions() {
        const countQuestions = parseInt(state.totalQuestions);
        shuffleData();
        for(let i=0; i<countQuestions; i++) {
            state.questionsArray.push(state.data[i]);
            state.answersArray.push(state.data[i].answer);
        };
        return;

    }
    function showNextQuestion() {
        if(state.currentQuestionNumber >= state.totalQuestions) {
            addDataToResultsScreen();
            // Show results screen - 2
            showScreen(2);
            return;
        };
        displayQuestion();
        startTimer();
    };
    function displayQuestion() {
        // Question Display
        const questionBlock = document.getElementById('question-block');
        
        const currentQuestion = state.questionsArray[state.currentQuestionNumber];
        questionBlock.textContent = currentQuestion.question;
        state.questionWiseJustifications.push(currentQuestion.justification);

        const optionsBlock = document.getElementById('options-block');
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
    function startTimer() {
        state.counter = parseInt(questionTimeSlider.value) * 60;

        state.timeInterval = setInterval(function() {
            state.counter-=1;
            if(state.counter <= 0) {
                clearInterval(state.timeInterval);
                onQuestionEnd();
            };

            displayTimer(state.counter);
        }, 1000);
    };
    function displayTimer(counter) {
        const minutesDisplay = document.getElementById('minutes-display');
        const secondsDisplay = document.getElementById('seconds-display');
        
        let seconds = counter % 60;
        let minutes = Math.floor(counter / 60);
        minutesDisplay.textContent = minutes;
        secondsDisplay.textContent = seconds;
        return;
    };
    function onQuestionEnd() {
        // Get DOM reference for selected question
        const selectedAnswer = document.querySelector('input[name="option"]:checked');
        if(selectedAnswer) {
            if(selectedAnswer.id === state.answersArray[state.currentQuestionNumber]) {
                state.totalMarks += 2;
                state.correctlyAnswered += 1;
            } else {
                state.totalMarks -= 1;
            };
        };
        state.currentQuestionNumber++;
        showNextQuestion();
    };
    function addDataToResultsScreen() {
        const correctlyAnswered = state.correctlyAnswered;
        const totalMarks = state.totalMarks;
        const questionsArray = state.questionsArray;

        const resultsScreen = document.getElementById('results-screen');

        const scoresDiv = document.createElement('div');
        const totalMarksHeading = document.createElement('h3');
        totalMarksHeading.textContent = `Total Marks: ${totalMarks}`;
        const correctlyAnsweredHeading = document.createElement('h3');
        correctlyAnsweredHeading.textContent = `Correctly Answered: ${correctlyAnswered}`;
        scoresDiv.appendChild(totalMarksHeading);
        scoresDiv.appendChild(correctlyAnsweredHeading);

        
        const questionJustficationDiv = document.createElement('div');
        for(let i=0; i<questionsArray.length; ++i) {
            const questionHeading = document.createElement('h4');
            const justificationParagraph = document.createElement('p');
            questionHeading.textContent = `Question: ${questionsArray[i].question}`;
            justificationParagraph.textContent = `Justification: ${questionsArray[i].justification}`;
            questionJustficationDiv.appendChild(questionHeading);
            questionJustficationDiv.appendChild(justificationParagraph);
        };

        scoresDiv.appendChild(questionJustficationDiv);
        resultsScreen.appendChild(scoresDiv);
        return;
    };
    
}) ();
