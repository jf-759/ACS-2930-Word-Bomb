document.addEventListener("DOMContentLoaded", function () {
    const letterDisplay = document.getElementById("random-letter");
    const timerDisplay = document.getElementById("timer");
    const messageDisplay = document.getElementById("message");
    const inputField = document.getElementById("word-input");
    const wordForm = document.getElementById("word-form");
    const newGameButton = document.getElementById("new-game");
    const continueGameButton = document.getElementById("continue-game");
    const finalScoreModalDisplay = document.getElementById("modal-final-score");
    let scoreDisplay = document.getElementById("score");
    let resetModalDisplay = document.getElementById("reset-modal");
    let nextRoundTimeout;

    let timeLeft = 10;
    let timer;
    let currentCluster = "";
    let currentScore = 0;

    console.log("Initial Score: ", currentScore);

    inputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            wordForm.dispatchEvent(new Event("submit"));
        }
    });

    // Fetch the current score from the backend
    async function getScore() {
        try {
            const response = await fetch('/get-score');
            const data = await response.json();
            return data.score;
        } catch (error) {
            console.error("Error fetching score:", error);
            return 0;
        }
    }

    function updateScore() {
        currentScore++;
        fetch("/update-score", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score: currentScore })
        })
        .then((response) => response.json())
        .then((data) => {
            scoreDisplay.innerText = data.score;
        })
        .catch((error) => console.error("Error updating score: ", error));
    }

    function fetchCluster() {
        return fetch("/get-cluster")
            .then(response => response.json())
            .then(data => {
                return data.cluster; 
            })
            .catch(error => {
                console.error("Error fetching cluster:", error);
                return ""; 
            });
    }

    // Initialize the score and set it on the page
    async function initializeScore() {
        const fetchedScore = await getScore();
        currentScore = fetchedScore || 0;
        scoreDisplay.innerText = currentScore;
    }

    async function startNewRound() {
        currentCluster = await fetchCluster();
        letterDisplay.textContent = `Cluster: ${currentCluster}`;

        timeLeft = 10;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        messageDisplay.textContent = "";

        inputField.disabled = false;
        inputField.value = "";
        inputField.focus();

        clearInterval(timer);
        timer = setInterval(countdown, 1000);
    }

    function countdown() {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        } else {
            clearInterval(timer);
            messageDisplay.textContent = "⏳ Time's up! Game Over.";
            disableGame();
            playAgain();
        }
    }

    // Display final score and show reset modal
    async function playAgain() {
        finalScore = currentScore;
        finalScoreModalDisplay.innerText = finalScore;
        resetModalDisplay.style.display = "flex";
    }

    function checkWord() {
        const word = inputField.value.trim();

        if (word && word.includes(currentCluster.toLowerCase())) {
            messageDisplay.textContent = "✅ Valid word! Next round.";
            messageDisplay.style.color = "green";
            updateScore();

            // Clear any previous timeout to avoid multiple scheduled rounds
            clearTimeout(nextRoundTimeout);

            // Delay before starting a new round so that the message displays long enough
            nextRoundTimeout = setTimeout(startNewRound, 2000);
        } else {
            messageDisplay.textContent = "❌ Invalid word! Try again.";
            messageDisplay.style.color = "red";
        }

        inputField.value = "";
    }

    function disableGame() {
        inputField.disabled = true;
        wordForm.querySelector("button").disabled = true;
    }

    // Reset the game and score
    function resetGame() {
        fetch("/reset-game", {
            method: "POST"
        }).then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                currentScore = 0;  // Reset the score locally
                scoreDisplay.innerText = "0";  // Reset score display
                messageDisplay.innerText = "";
                resetModalDisplay.style.display = "none";
                startNewRound();
            }
        })
        .catch(error => console.log("Error resetting game:", error));
    }

    // Continue the game without resetting the score
    async function continueGame() {
        const score = await getScore();
        currentScore = score;  // Continue with the fetched score
        scoreDisplay.innerText = score;
        messageDisplay.innerText = "";
        resetModalDisplay.style.display = "none";
        startNewRound();
    }

    // Add event listeners to the modal buttons
    newGameButton.addEventListener("click", () => resetGame());
    continueGameButton.addEventListener("click", () => continueGame());

    // Initialize the score on page load
    initializeScore().then(() => {
        startNewRound();
    });

    wordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        checkWord();
    });
});
