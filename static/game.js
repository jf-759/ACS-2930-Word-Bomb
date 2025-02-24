document.addEventListener("DOMContentLoaded", function () {
    const letterDisplay = document.getElementById("random-letter");
    const timerDisplay = document.getElementById("timer");
    const messageDisplay = document.getElementById("message");
    const inputField = document.getElementById("word-input");
    const wordForm = document.getElementById("word-form");
    let scoreDisplay = document.getElementById("score");

    let timeLeft = 10;
    let timer;
    let currentLetter = "";

    document.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            checkWord();
        }
    });
    

    function getRandomLetter() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[Math.floor(Math.random() * alphabet.length)];

    }

    function startNewRound() {
        currentLetter = getRandomLetter();
        letterDisplay.textContent = `Letter: ${currentLetter}`;

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
        }
    }

    function checkWord() {
        const word = inputField.value.trim();

        if (word && word.startsWith(currentLetter.toLowerCase())) {
            messageDisplay.textContent = "✅ Valid word! Next round.";
            messageDisplay.style.color = "green";
            updateScore();
            startNewRound();
        } else {
            messageDisplay.textContent = "❌ Invalid word! Try again.";
            messageDisplay.style.color = "red";
        }

        inputField.value = "";
    }

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

    function disableGame() {
        inputField.disabled = true;
        wordForm.querySelector("button").disabled = true;
    }

    startNewRound();
  
    wordForm.addEventListener("submit", function(e) {
        e.preventDefault();
        checkWord;
    })
}); 