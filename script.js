(function () {
    const state = {
        counter: 0,
        timeInterval: null,
        totalQuestions: 0,
        questionsArray: [],
        currentQuestionNumber: 0,
        correctlyAnswered: 0,
        totalMarks: 0,
        questionWiseJustifications: [],
        userSubmit: false
    };
    // Get DOM references
    const questionTimeSlider = document.getElementById('question-time');
    const sliderValue = document.getElementById('slider-value');
    const startQuizButton = document.getElementById('start-game-button');
    const errorSpanText = document.getElementById('error');
    const submitAnswerButton = document.getElementById('submit-answer-button');

    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        // Slider Value display after the content for the DOM is loaded
        sliderValue.textContent = questionTimeSlider.value;
    });
    questionTimeSlider.addEventListener('input', function() {
        sliderValue.textContent = this.value;
    });
    startQuizButton.addEventListener('click', startQuiz);

    // submitAnswerButton.addEventListener('click', function() {
    //     state.userSubmit = true;
    // });

    async function startQuiz(e) {
        e.preventDefault();
        errorSpanText.innerHTML = "";
        // DOM Element reference
        const numQuestionsInput = document.getElementById('number-of-questions');
        const minNumQuestions = numQuestionsInput.min;
        const maxNumQuestions = numQuestionsInput.max;

        // Functions
        function validateNumberOfQuestions(numberOfQuestions, min, max) {
            if(!numberOfQuestions || numberOfQuestions < 5 || numberOfQuestions > 100) {
                throw new Error(`Please select minimum ${min} and maximum ${max} as number of questions.`)
            };
            console.log(numberOfQuestions.value, questionTimeSlider.value)  // Debug Log
            return;
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
            // Get unique data
            const data = await fetchData();
            // console.log(data);  // Debug log
            for(let idx of uniqueNumArr) {
                state.questionsArray.push(data[idx]);
            };
            return;
        };
        function makeQuizScreenVisible() {
            const quizScreen = document.getElementById('quiz-screen');
            const startScreen = document.getElementById('start-screen');

            startScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            return;
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
        function displayQuestion() {
            const questionsForm = document.getElementById('questions-container-form');

            // Question Display
            const questionBlock = document.getElementById('question-block');

            const currentQuestion = state.questionsArray[state.currentQuestionNumber];
            
            questionBlock.textContent = currentQuestion.question;

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

                questionsForm.appendChild(optionDiv);
            });
        };
        function checkAnswer() {

        };


        try {
            // DOM references:
            state.totalQuestions = parseInt(numQuestionsInput.value);
            state.currentQuestionNumber = 0;
            state.counter = 0;
            // Check whether the number of questions are within the range
            validateNumberOfQuestions(state.totalQuestions, minNumQuestions, maxNumQuestions);
            // Get Questions in State array
            await getRandomQuestionsInArray(state.totalQuestions, minNumQuestions, maxNumQuestions);
            // Make screen quiz visible
            makeQuizScreenVisible();

            function showNextQuestion() {
                if(state.currentQuestionNumber >= state.totalQuestions) {
                    finishQuiz();
                    return;
                };
                displayQuestion();
                startTimer();
            };

            function finishQuiz() {

            }

            showNextQuestion();
            
        } catch (error) {
            errorSpanText.innerHTML = error;
            stateReset();
        }
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

    function stateReset() {
        state = {
            counter: 0,
            timeInterval: null,
            totalQuestions: 0,
            questionsArray: [],
            currentQuestionNumber: 0,
            correctlyAnswered: 0,
            totalMarks: 0,
            questionWiseJustifications: []
        };
    };
    
}) ();
