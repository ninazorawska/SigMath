
// Load User Data from JSON
let users = [];
let questions = [];
let currentQuestionIndex = 0;  // Track the current question
// Hardcoded topics
const topics = [
    {
        "name": "Linear Algebra",
        "article": "Linear algebra is central to almost all areas of mathematics. For instance, linear algebra is fundamental in modern presentations of geometry, including for defining basic objects such as lines, planes and rotations. Also, functional analysis, a branch of mathematical analysis, may be viewed as the application of linear algebra to function spaces. (see article: https://en.wikipedia.org/wiki/Linear_algebra)",
        "relatedTopics": ["Arithmetics and Algebra", "Trigonometry"]
    },
    {
        "name": "Complex Numbers",
        "article": "Complex numbers allow solutions to all polynomial equations, even those that have no solutions in real numbers. More precisely, the fundamental theorem of algebra asserts that every non-constant polynomial equation with real or complex coefficients has a solution which is a complex number. For example, the equation (x + 1)^2 = -9  has no real solution, because the square of a real number cannot be negative, but has the two nonreal complex solutions -1+3i and -1-3i. (see article: https://en.wikipedia.org/wiki/Complex_number)",
        "relatedTopics": ["Linear Algebra"]
    }, 
    {
        "name": "Arithmetics and Algebra",
        "article": "Arithmetic and algebra form the backbone of all higher-level math. " +
                    "Before moving on to more advanced topics like linear algebra or calculus, it's essential to understand the following core ideas: " +
                    "Order of Operations tells you the correct sequence for solving math expressions (think: parentheses first, then exponents, etc.). " +
                    "Distributive Property helps break down expressions and simplify them efficiently. " +
                    "Fractions involve rules for adding, subtracting, multiplying, and dividing—especially important when dealing with equations or real-world quantities.",
        "relatedTopics": []
    },
    {
        "name": "Trigonometry",
        "article": "Trigonometry is a branch of mathematics that studies the relationships between the angles and sides of triangles—especially right-angled triangles. It’s one of the most important tools in geometry, physics, engineering, and even computer graphics."+
                    "At its core, trigonometry is built on three main functions:"+
                    "Sine (sin) — compares the opposite side to the hypotenuse"+
                    "Cosine (cos) — compares the adjacent side to the hypotenuse"+
                    "Tangent (tan) — compares the opposite side to the adjacent side"+
                    "These are often remembered using the acronym SOH-CAH-TOA."+
                    "Trigonometry is especially useful when:"+
                    "You know one or two sides of a triangle and want to find the others"+
                    "You know an angle and want to calculate side lengths"+
                    "You need to work with angles in physics, navigation, or wave motion",
        "relatedTopics": []
    }
];
async function loadUsers() {
    try {
        const response = await fetch('users.json');
        users = await response.json();
        console.log("[DEBUG] Loaded users:", users);  // Debugging line
    } catch (error) {
        console.error("[ERROR] Could not load users.json:", error);
    }
}

// Load Questions by Topic and Subtopic with Callback Support
function loadQuestions(callback) {
    console.log("[DEBUG] Starting to load questions...");

    fetch('questions.json?' + new Date().getTime())  // Bypass cache
        .then(response => {
            console.log("[DEBUG] Received response from questions.json with status:", response.status);
            if (!response.ok) {
                throw new Error(`[ERROR] Failed to load questions.json. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            questions = data.questions;
            console.log("[DEBUG] Loaded questions:", JSON.stringify(questions, null, 2));  // Debugging line

            // Run the callback if provided
            if (callback) callback();
        })
        .catch(error => {
            console.error('[ERROR] Error loading questions:', error);
        });
}





// Log to verify it's working
console.log("[DEBUG] Loaded hardcoded topics:", topics);


// Call the function to load users on page load
window.onload = function() {
    loadUsers();
    showLogin();
}

// Show Login Screen
function showLogin() {
    hideAllScreens();
    document.getElementById('login-screen').classList.add('active');
}

// Show Signup Screen
function showSignup() {
    hideAllScreens();
    document.getElementById('signup-screen').classList.add('active');
}

// Show Main Menu
function showMainMenu() {
    hideAllScreens();

    // Clear Article Display
    document.getElementById('article-title').textContent = '';
    document.getElementById('article-content').textContent = '';
    document.getElementById('article-display').classList.add('hidden');

    document.getElementById('main-menu').classList.add('active');
}


function openSearchTopic() {
    hideAllScreens();
    document.getElementById('search-topic-screen').classList.add('active');

    const searchBar = document.getElementById('search-bar');
    searchBar.value = '';
    searchBar.setAttribute("autocomplete", "off");
    searchBar.blur();

    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    suggestionsList.classList.add("hidden");

    const articleDisplay = document.getElementById("article-display");
    articleDisplay.classList.add("hidden");
    document.getElementById("article-title").textContent = '';
    document.getElementById("article-content").textContent = '';
    document.getElementById("practice-button").style.display = "none";

    showSuggestions(); // ✅ re-trigger suggestions list
}






function checkLastTopic(){ // edit this to ONLY SHOW if the user has had a topic in the past
    hideAllScreens();
    if (users[0].last_topic != null){
        displayArticle(users[0].last_topic);
    }
    else{
        openSearchTopic();
    }
}

// Show Profile Screen with Scores
function showProfile() {
    hideAllScreens();

    // Get the logged-in user's data
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        document.getElementById('profile-username').textContent = loggedInUser.username;
        
        // Display Scores for Each Topic
        const scoreContainer = document.getElementById('profile-scores');
        scoreContainer.innerHTML = '';

        if (loggedInUser.scores && loggedInUser.scores.length > 0) {
            loggedInUser.scores.forEach(score => {
                const scoreItem = document.createElement('p');
                scoreItem.innerHTML = `<strong>${score.topic}:</strong> ${score.score} points`;
                scoreContainer.appendChild(scoreItem);
            });
        } else {
            scoreContainer.innerHTML = '<p>No scores available.</p>';
        }
    } else {
        document.getElementById('profile-username').textContent = 'Guest';
    }

    document.getElementById('profile-screen').classList.add('active');
}


// Hide All Screens
function hideAllScreens() {
    var screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
}

// Login Functionality
function login() {
    let username = document.getElementById('login-username').value.trim();
    let password = document.getElementById('login-password').value.trim();
    
    console.log("[DEBUG] Attempting to login with:", username, password);

    // Check if the user exists in the JSON data
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        alert(`Login Successful! Welcome, ${user.username}`);
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        showMainMenu();
    } else {
        alert("Invalid Credentials");
    }
}

// Signup Functionality (Basic, no JSON saving yet)
function signup() {
    let username = document.getElementById('signup-username').value.trim();
    let password = document.getElementById('signup-password').value.trim();

    if (username && password) {
        // Check if username already exists
        let existingUser = users.find(u => u.username === username);

        if (existingUser) {
            alert("Username already exists!");
        } else {
            // Add new user to the array (Temporary, won't persist)
            users.push({
                username: username,
                password: password,
                streak: 0,
                longest_streak: 0,
                score: 0,
                total_questions: 0,
                last_topic: null,
                badges: [],
                last_login: null,
                articles_read: []
            });

            alert("Account created successfully! You can now login.");
            showLogin();
        }
    } else {
        alert("Please enter both username and password.");
    }
}

// Show Suggestions when typing
function showSuggestions() {
    const searchBar = document.getElementById("search-bar");
    const suggestionsList = document.getElementById("suggestions-list");
    const query = searchBar.value.toLowerCase();

    suggestionsList.innerHTML = "";

    if (query.length > 0) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        const filteredTopics = topics.filter(topic => 
            topic.name.toLowerCase().includes(query)
        );

        filteredTopics.forEach(topic => {
            const listItem = document.createElement("li");
            let completed = false;
            let score = 0;

            if (loggedInUser && loggedInUser.scores) {
                const topicScore = loggedInUser.scores.find(s => s.topic === topic.name);
                if (topicScore) {
                    completed = true;
                    score = topicScore.score;
                }
            }

            if (completed) {
                listItem.classList.add('completed-topic');
                listItem.innerHTML = `${topic.name} <span class="score">(Points: ${score})</span>`;
                listItem.style.color = "violet";
                listItem.style.fontWeight = "bold";
            } else {
                listItem.textContent = topic.name;
                listItem.style.color = "black";
                listItem.style.fontWeight = "normal";
            }

            listItem.onclick = function() {
                displayArticle(topic);
            };

            suggestionsList.appendChild(listItem);
        });

        if (filteredTopics.length === 0) {
            const noResultItem = document.createElement("li");
            noResultItem.textContent = "No topics found";
            noResultItem.style.color = "gray";
            noResultItem.style.fontStyle = "italic";
            suggestionsList.appendChild(noResultItem);
        }

        suggestionsList.classList.remove('hidden'); // Show list
    } else {
        suggestionsList.classList.add('hidden'); // Hide list
    }
}





// Display Article Function
function displayArticle(topic) {
    document.getElementById("article-title").textContent = topic.name;
    document.getElementById("article-content").textContent = topic.article;
    document.getElementById("article-display").classList.remove("hidden");

    // Add a button to start questions
    const practiceButton = document.getElementById("practice-button");
    practiceButton.style.display = "block";
    practiceButton.onclick = function() {
        // Check Related Topics Before Going to Questions
        checkRelatedTopics(topic);

        // Load questions and go to the questions screen
        loadQuestions(function() {
            displayQuestions(topic);
        });
    };
}




// Start practicing the selected topic
function startPractice() {
    hideAllScreens();
    document.getElementById('profile-screen').classList.add('active');
}



function displayQuestions(topic) {
    hideAllScreens();
    document.getElementById('questions-screen').classList.add('active');
    document.getElementById('questions-topic-title').textContent = topic.name;

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            const selectedTopic = questions.find(t => t.name.toLowerCase().trim() === topic.name.toLowerCase().trim());

            if (selectedTopic && selectedTopic.subquestions.length > 0) {
                currentQuestionIndex = 0;
                displayCurrentQuestion(selectedTopic.subquestions);
            } else {
                document.getElementById('question-container').innerHTML = '<p>No questions available for this topic.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading questions:', error);
        });
}


// Display the Current Question
function displayCurrentQuestion(subquestions) {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    // Get the current question
    const questionData = subquestions[currentQuestionIndex];

    // Display Question Number and Text
    const questionNumber = document.createElement('h3');
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${subquestions.length}`;
    questionContainer.appendChild(questionNumber);

    const questionTitle = document.createElement('h3');
    questionTitle.textContent = questionData.question;
    questionContainer.appendChild(questionTitle);

    // Display Choices as Radio Buttons
    questionData.choices.forEach(choice => {
        const choiceContainer = document.createElement('div');
        choiceContainer.classList.add('choice-container');

        const choiceInput = document.createElement('input');
        choiceInput.type = 'radio';
        choiceInput.name = `question-${currentQuestionIndex}`;
        choiceInput.value = choice;
        choiceInput.onchange = function() {
            document.getElementById('next-question').disabled = false;
            saveAnswer(currentQuestionIndex, choice);
        };
        choiceContainer.appendChild(choiceInput);

        const choiceLabel = document.createElement('label');
        choiceLabel.textContent = choice;
        choiceContainer.appendChild(choiceLabel);

        questionContainer.appendChild(choiceContainer);
    });

    // Update Navigation Buttons
    updateNavigationButtons(subquestions);
}

// Save the Selected Answer
let selectedAnswers = {};  // Store answers for each question
function saveAnswer(questionIndex, choice) {
    selectedAnswers[questionIndex] = choice;
}

// Update Navigation Buttons
function updateNavigationButtons(subquestions) {
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');

    // Disable Previous Button on First Question
    prevButton.disabled = (currentQuestionIndex === 0);

    // Enable Next Button if Answered
    nextButton.disabled = !selectedAnswers[currentQuestionIndex];

    // Change Next Button Text on Last Question
    if (currentQuestionIndex === subquestions.length - 1) {
        nextButton.textContent = "Submit";
        nextButton.onclick = function() {
            submitAnswers(subquestions);
        };
    } else {
        nextButton.textContent = "Next →";
        nextButton.onclick = nextQuestion;
    }
}

// Go to the Next Question
function nextQuestion() {
    currentQuestionIndex++;
    displayCurrentQuestion(questions.find(t => t.name === document.getElementById('questions-topic-title').textContent).subquestions);
}

// Go to the Previous Question
function prevQuestion() {
    currentQuestionIndex--;
    displayCurrentQuestion(questions.find(t => t.name === document.getElementById('questions-topic-title').textContent).subquestions);
}



function submitAnswers(subquestions) {
    let score = 0;

    // Loop through all questions and check answers
    subquestions.forEach((subquestion, index) => {
        const correctAnswer = subquestion.answer.trim().replace(/\s+/g, ' ');
        const selectedAnswer = selectedAnswers[index]?.trim().replace(/\s+/g, ' ');

        if (selectedAnswer === correctAnswer) {
            score++;
        }
    });

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        let existingTopicScore = loggedInUser.scores?.find(s => s.topic === document.getElementById('questions-topic-title').textContent);

        if (existingTopicScore) {
            existingTopicScore.score = score;
        } else {
            if (!loggedInUser.scores) loggedInUser.scores = [];
            loggedInUser.scores.push({
                topic: document.getElementById('questions-topic-title').textContent,
                score: score
            });
        }

        // Save Updated User Data
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        alert(`You scored ${score} points!`);

        // ✅ Fully reset search topic screen so old topics do not persist
        resetSearchScreen();

        // ✅ Send user back to main menu
        showMainMenu();
    } else {
        alert('Please log in to save your score.');
    }
}

// ✅ Create a function to fully reset the search topic screen
function resetSearchScreen() {
    const searchBar = document.getElementById('search-bar');
    const suggestionsList = document.getElementById('suggestions-list');

    searchBar.value = ''; // Clear search input
    suggestionsList.innerHTML = ''; // Clear the list
    suggestionsList.classList.add("hidden"); // Hide suggestions

    document.getElementById("article-display").classList.add("hidden");
    document.getElementById("article-title").textContent = '';
    document.getElementById("article-content").textContent = '';
    document.getElementById("practice-button").style.display = "none";
}



// Check Answer and Update Score
function checkAnswer(question, selectedChoice, correctAnswer) {
    // Get Current Score
    let currentScore = parseInt(document.getElementById('current-score').textContent);

    // Check if the selected answer is correct
    if (selectedChoice === correctAnswer) {
        currentScore++;
        alert('Correct!');
    } else {
        alert(`Incorrect! The correct answer is ${correctAnswer}`);
    }

    // Update the Score in the Sidebar
    document.getElementById('current-score').textContent = currentScore;

    // Save Score in Local Storage
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // If the user has already attempted this topic, update the score
        let existingTopicScore = loggedInUser.scores?.find(s => s.topic === document.getElementById('questions-topic-title').textContent);

        if (existingTopicScore) {
            existingTopicScore.score = currentScore;
        } else {
            if (!loggedInUser.scores) loggedInUser.scores = [];
            loggedInUser.scores.push({
                topic: document.getElementById('questions-topic-title').textContent,
                score: currentScore
            });
        }

        // Save Updated User Data
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        // Update the Topic List to reflect the new score
        showSuggestions();
    }
}


// Show Search Topic Screen
function openSearchTopic() {
    hideAllScreens();
    document.getElementById('search-topic-screen').classList.add('active');

    // Clear Article Display
    document.getElementById('article-title').textContent = '';
    document.getElementById('article-content').textContent = '';
    document.getElementById('article-display').classList.add('hidden');

    // Clear Search Input and Suggestions List
    document.getElementById('search-bar').value = '';
    document.getElementById('suggestions-list').innerHTML = '';

    // Display All Topics with Subtopics
    questions.forEach(topic => {
        const listItem = document.createElement("li");
        listItem.textContent = topic.name;

        // Onclick: Display Subtopics for the selected topic
        listItem.onclick = function() {
            displaySubtopics(topic);
        };

        document.getElementById('suggestions-list').appendChild(listItem);
    });
}

// Display Subtopics for Selected Topic
function displaySubtopics(topic) {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';

    // Display Subtopics
    topic.subquestions.forEach(subtopic => {
        const subtopicItem = document.createElement("li");
        subtopicItem.textContent = subtopic.question;

        suggestionsList.appendChild(subtopicItem);
    });
}

function checkRelatedTopics(topic) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) return;

    const selectedTopic = topics.find(t => t.name === topic.name);

    if (!selectedTopic || !selectedTopic.relatedTopics || selectedTopic.relatedTopics.length === 0) return;

    let recommendationMessage = `To better understand "${topic.name}", consider revising the following topics first:\n\n`;

    selectedTopic.relatedTopics.forEach(related => {
        const relatedScore = loggedInUser.scores?.find(s => s.topic === related)?.score || 0;
        const threshold = 5;

        recommendationMessage += `• ${related}: ${relatedScore} points`;
        if (relatedScore < threshold) {
            recommendationMessage += ` (Consider revising)`;
        }
        recommendationMessage += "\n";
    });

    showRecommendationModal(selectedTopic.relatedTopics[0], recommendationMessage);
}


function showRecommendationModal(topic, message) {
    let modal = document.createElement("div");
    modal.id = "recommendation-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.width = "400px";
    modal.style.textAlign = "center";
    modal.style.zIndex = "1000";

    modal.innerHTML = `<p>${message}</p>`;

    // Add "Take Quiz" button for Linear Algebra
    let takeQuizButton = document.createElement("button");
    takeQuizButton.innerText = `Take "${topic}" Quiz`;
    takeQuizButton.style.background = "#28a745";
    takeQuizButton.style.color = "white";
    takeQuizButton.style.padding = "10px 20px";
    takeQuizButton.style.border = "none";
    takeQuizButton.style.borderRadius = "5px";
    takeQuizButton.style.cursor = "pointer";
    takeQuizButton.style.marginTop = "10px";

    takeQuizButton.onclick = function () {
        document.body.removeChild(modal);
        let relatedTopicobj = findTopic(topic);
        if (relatedTopicobj) {
            displayQuestions(relatedTopicobj); // Start the quiz for Linear Algebra
        } else {
            alert("Error: related topic not found.");
        }
    };

    // Add Close Button
    let closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.background = "#dc3545";
    closeButton.style.color = "white";
    closeButton.style.padding = "10px 20px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.marginTop = "10px";
    closeButton.onclick = function () {
        document.body.removeChild(modal);
    };

    // Append buttons to modal
    modal.appendChild(takeQuizButton);
    modal.appendChild(closeButton);
    
    document.body.appendChild(modal);
}

function findTopic(topicName) {
    return topics.find(t => t.name === topicName);
}











