(function () {
    // Get DOM references
    const questionTimeSlider = document.getElementById('question-time');
    const sliderValue = document.getElementById('slider-value');
    const startQuizButton = document.getElementById('start-game-button');
    const errorSpanText = document.getElementById('error');

    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        // Slider Value display after the content for the DOM is loaded
        sliderValue.innerHTML = questionTimeSlider.value;
    });
    questionTimeSlider.addEventListener('input', function() {
        sliderValue.innerHTML = this.value;
    });
    startQuizButton.addEventListener('click', startQuiz);

    function startQuiz(e) {
        e.preventDefault();
        errorSpanText.innerHTML = "";

        // Quiz vars
        let points = 0;

        // DOM references:
        const numberOfQuestions = document.getElementById('number-of-questions');
        const pointsDisplay = document.getElementById('points-display');
        const questionContainer = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');

        try {
            // Check if the values enterd by the user are in range
            checkStartQuizParams(numberOfQuestions);
            // Make quiz screen visible and start screen hidden
            makeQuizVisible();
            // Get Random Question from the json file
            const questionsArr = getRandomQuestions(numberOfQuestions.value, numberOfQuestions.min, numberOfQuestions.max);
            // Initialize points counter
            pointsDisplay.innerHTML = points;
            // Initialize timer
            // Display 
        } catch (error) {
            console.error('Error: ', error);
            errorSpanText.innerHTML = error;
            return;
        };
    };

    async function getRandomQuestions(numQuestionsValue, min, max) {
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
        const questionsArr = [];
        for(let idx of uniqueNumArr) {
            questionsArr.push(data[idx]);
        };
        
        return questionsArr;
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

    function showQuestion() {

    };
    
    function selectAnswer() {

    };

    function showResults() {

    };

    function restartQuiz() {

    };

    function chooseRandomQuestion() {

    };

    function updatePoint() {

    };
}) ();
