(function () {
    const state = {
        counter: 0,
        timeInterval: null,
        totalQuestions: 0,
        questionsArray: [],
        currentQuestionNumber: 0,
        correctlyAnswered: 0,
        totalMarks: 0,
        questionWiseJustifications: []
    };
    // Get DOM references
    const questionTimeSlider = document.getElementById('question-time');
    const sliderValue = document.getElementById('slider-value');
    const startQuizButton = document.getElementById('start-game-button');
    const errorSpanText = document.getElementById('error');

    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        // Slider Value display after the content for the DOM is loaded
        sliderValue.textContent = questionTimeSlider.value;
    });
    questionTimeSlider.addEventListener('input', function() {
        sliderValue.textContent = this.value;
    });
    startQuizButton.addEventListener('click', startQuiz);

    async function startQuiz(e) {
        e.preventDefault();
        errorSpanText.innerHTML = "";

        // DOM references:
        const numberOfQuestionsInput = document.getElementById('number-of-questions');

        try {
            // Check if the values enterd by the user are in range
            checkStartQuizParams(numberOfQuestionsInput);
            // Make quiz screen visible and start screen hidden
            makeQuizVisible();
            // Get Random Question from the json file
            await getRandomQuestionsInArray(numberOfQuestionsInput.value, numberOfQuestionsInput.min, numberOfQuestionsInput.max);
            // Timer display
            startTimer();
            // Show question
            displayQuestion();
            // Initialize timer
            // Display 
        } catch (error) {
            console.error('Error: ', error);
            errorSpanText.innerHTML = error;
            return;
        };
    };

    async function getRandomQuestionsInArray(numQuestionsValue, min, max) {
        const count = parseInt(numQuestionsValue);
        const parsedMin = parseInt(min);
        const parsedMax = parseInt(max);

        // Create set of unique numbers
        const uniqueNums = new Set();
        while(uniqueNums.size < count) {
            const randomNum = parseInt(Math.floor(Math.random() * (parsedMax - parsedMin))) + parseInt(parsedMin);
            uniqueNums.add(randomNum);
        };

        // Convert set to array
        const uniqueNumArr = Array.from(uniqueNums);
        // console.log(uniqueNumArr);  // Debug log
        const questionsArr = [];
        // Get unique data
        const data = await fetchData();
        // console.log(data);  // Debug log
        for(let idx of uniqueNumArr) {
            state.questionsArray.push(data[idx]);
        };

        return;
    };

    async function fetchData() {
        return fetch('./data.json')
            .then(response => {
                if(!response.ok) {
                    throw new Error('Data not found');
                };
                return response.json();
            })
    };

    function checkStartQuizParams(numberOfQuestions) {
        if(!numberOfQuestions.value || numberOfQuestions.value < 5 || numberOfQuestions.value > 100) {
            throw new Error(`Please select minimum ${numberOfQuestions.min} and maximum ${numberOfQuestions.max} as number of questions.`)
        };
        console.log(numberOfQuestions.value, questionTimeSlider.value)  // Debug Log
        return;
    };

    function makeQuizVisible() {
        const quizScreen = document.getElementById('quiz-screen');
        const startScreen = document.getElementById('start-screen');

        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        return;
    };

    function startTimer() {
        state.counter = parseInt(questionTimeSlider.value) * 60;

        state.timeInterval = setInterval(function() {
            if(state.counter <= 0) {
                clearInterval(state.timeInterval);
            };

            displayTimer(state.counter);
            state.counter-=1;
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

    function displayQuestion() {
        const questionContainer = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');

        const currentQuestion = state.questionsArray[state.currentQuestionNumber];
        state.currentQuestionNumber+=1;

        const questionElement = document.createElement('h3');
        questionElement.textContent = currentQuestion.question;
        questionContainer.appendChild(questionElement);

        const optionContainers = [];
        Object.entries(currentQuestion.options).forEach(([key, value]) => {
            const optionContainer = document.createElement('article');
            optionContainer.id = 'option'
            optionContainer.textContent = value;
            optionContainers.push(optionContainer);
        });

        optionContainers.forEach(option => {
            optionsContainer.appendChild(option);
        });
        
    }
}) ();
