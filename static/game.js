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
    let score = 0;
    
    console.log("Initial Score: ", score);

    inputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            wordForm.dispatchEvent(new Event("submit"));
        }
    });

    function updateScore() {
        fetch("/update-score", {
            method: "POST",
        })
        .then((response) => response.json())
        .then((data) => {
                scoreDisplay.innerText = data.score;
            })
        .catch((error) => console.error("Error: ", error));
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

    function getScore(){
        return fetch('/get-score')
            .then(response => response.json())
            .then(data => {
                return data.score;
            })
            .catch((error) => {
                console.error("Error fetching score:", error);
            });
    }
    
    async function playAgain(){
        finalScore = await getScore()
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

    // If the user wants to start a new game and clear their previous score
    function resetGame(){
        fetch("/reset-game", {
            method: "POST"
        }).then(response => response.json())
        .then(data=> {
            if (data.status === "success") {
                scoreDisplay.innerText = "0";
                messageDisplay.innerText = "";
                resetModalDisplay.style.display = "none";
                startNewRound();
            }
        })
        .catch(error => console.log("Error resetting game:", error));
    }
    
    // If the user wants to continue the game and maintain their previous score
    async function continueGame(){
        const score = await getScore();

        scoreDisplay.innerText = score;
        messageDisplay.innerText = "";
        resetModalDisplay.style.display = "none";
        startNewRound();
    }

    // Add event listeners to the modal buttons
    newGameButton.addEventListener("click", ()=> resetGame());
    continueGameButton.addEventListener("click", ()=> continueGame());

    // Make sure that the user's score persists on reload
    getScore().then(score => {
        console.log('score', score)
        scoreDisplay.innerText = score })

    startNewRound();

    wordForm.addEventListener("submit", function(e) {
        e.preventDefault();
        checkWord();
    });
});
