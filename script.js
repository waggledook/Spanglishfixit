class SpanglishFixitGame {
    constructor(sentences) {
        this.originalSentences = sentences;
        this.sentences = this.shuffle([...sentences]);
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.timer = 120; // 2 minutes
        this.interval = null;
        this.gameActive = false;
        this.reviewMode = false;
        this.currentErrorWord = null; // Track the selected error word

        // Define methods before binding them
        this.startGame = () => {
            this.gameActive = true;
            this.currentIndex = 0;
            this.score = 0;
            this.timer = 120;
            this.wrongAnswers = [];
            document.getElementById("score").textContent = this.score;
            document.getElementById("feedback").textContent = "";
            document.getElementById("sentence").textContent = "";
            document.getElementById("answer").value = "";
            document.getElementById("timer").textContent = "Time left: 120s";
            document.getElementById("timer-bar").style.width = "100%";
            document.getElementById("restart").style.display = "none";
            document.getElementById("start").style.display = "none";
            this.updateSentence();
            this.startTimer();
        };

        // Remove the duplicate restartGame arrow function here!

        this.startReview = () => {
            if (this.wrongAnswers.length === 0) return;
            this.reviewMode = true;
            this.currentIndex = 0;
            // Hide the Review button when entering review mode:
            document.getElementById("review").style.display = "none";
            this.updateSentence();
        };

        this.setupInputListener = () => {
            document.getElementById("answer").addEventListener("keyup", (event) => {
                if (event.key === "Enter") {
                    this.checkAnswer();
                }
            });
        };

        // Now bind the methods that are defined as arrow functions
        this.startGame = this.startGame.bind(this);
        this.startReview = this.startReview.bind(this);
        this.setupInputListener = this.setupInputListener.bind(this);

        // Note: We will use the prototype method for restartGame(), so don't bind an arrow function version.
        this.initUI();
    }

    shuffle(array) {
        // This function shuffles the array randomly
        return array.sort(() => Math.random() - 0.5);
    }

    initUI() {
        console.log("Game script is running!");
        // Set the page title
        document.title = "Spanglish Fixit Challenge";
        document.body.innerHTML = `
    <style>
    /* General body styles */
    body {
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #2E3192, #1BFFFF);
        color: white;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
    }
    /* Instructions overlay */
    #instructions-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    #instructions-box {
        background: #333;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        text-align: left;
    }
    #instructions-box h2 {
        margin-top: 0;
    }
    /* Close instructions button */
    #close-instructions {
        margin-top: 15px;
        padding: 5px 10px;
        background: #28a745;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        transition: 0.3s;
    }
    #close-instructions:hover {
        opacity: 0.8;
    }
    /* Game container */
    #game-container {
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
    }
    /* Paragraph style */
    p {
        font-size: 18px;
    }
    /* Input styles */
    input {
        padding: 10px;
        font-size: 16px;
        border-radius: 5px;
        border: none;
        outline: none;
        text-align: center;
    }
    input.correct {
        border: 2px solid #00FF00;
        background-color: rgba(0, 255, 0, 0.2);
    }
    input.incorrect {
        border: 2px solid #FF0000;
        background-color: rgba(255, 0, 0, 0.2);
    }
    /* Button styles for Start, Restart, Review */
    button {
        padding: 10px 20px;
        font-size: 18px;
        margin-top: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.3s;
    }
    button:hover {
        opacity: 0.8;
    }
    #start {
        background: #28a745;
        color: white;
    }
    #restart {
        background: #007bff;
        color: white;
        display: none;
    }
    #review {
        background: #ffc107;
        color: black;
        display: none;
    }
    /* Timer bar */
    #timer-bar {
        width: 100%;
        height: 10px;
        background: red;
        transition: width 1s linear;
    }
</style>
    <!-- Instructions Overlay -->
    <div id="instructions-overlay">
        <div id="instructions-box">
            <h2>How to Play</h2>
            <p>Welcome to the Spanglish Fixit Challenge! Here's what to do:</p>
            <ul>
                <li>Click the incorrect word in each sentence.</li>
                <li>After clicking, type the correct word.</li>
                <li>The points available decrease over time (shown by the bar).</li>
                <li>Incorrect clicks or wrong corrections lose you 50 points.</li>
            </ul>
            <p>Good luck!</p>
            <button id="close-instructions">Got It!</button>
        </div>
    </div>
    <!-- Game Container -->
    <div id="game-container">
        <h1>Spanglish Fixit Challenge</h1>
        <div id="timer-bar"></div>
        <p id="timer">Time left: 120s</p>
        <!-- Points bar container -->
        <div id="points-bar-container" style="width:100%; background: #555; height: 10px; margin-top: 5px;">
            <div id="points-bar" style="width: 100%; height: 100%; background: #0f0; transition: width 0.1s linear;"></div>
        </div>
        <p id="sentence"></p>
        <p>Click the error and type the correction:</p>
        <input type="text" id="answer" autofocus>
        <p id="feedback"></p>
        <p>Score: <span id="score">0</span></p>
        <button id="start">Start Game</button>
        <button id="restart">Restart</button>
        <button id="review">Review Mistakes</button>
    </div>
`;
        document.getElementById("close-instructions").addEventListener("click", () => {
            document.getElementById("instructions-overlay").style.display = "none";
        });
        // Using arrow functions to preserve the class context
        document.getElementById("start").addEventListener("click", () => this.startGame());
        document.getElementById("restart").addEventListener("click", () => this.restartGame());
        document.getElementById("review").addEventListener("click", () => this.startReview());
        this.setupInputListener();
    }

    updateSentence() {
    const currentSet = this.reviewMode ? this.wrongAnswers : this.sentences;
    if (this.currentIndex < currentSet.length) {
        const currentSentence = currentSet[this.currentIndex];
        const sentenceParts = currentSentence.sentence.split(" ");
        let sentenceHTML = sentenceParts.map((word) => `<span class="clickable-word">${word}</span>`).join(" ");
        document.getElementById("sentence").innerHTML = sentenceHTML;
        // Re-enable clicking for the new sentence:
        document.getElementById("sentence").style.pointerEvents = "auto";

        // Initialize the click timer for scoring
        this.startClickTime = Date.now();

        // Clear any existing points interval (if any)
        if (this.pointsInterval) clearInterval(this.pointsInterval);

        // Start updating the points bar for the click phase
        this.pointsInterval = setInterval(() => {
            let elapsed = Date.now() - this.startClickTime;
            let availablePoints = Math.max(100 - Math.floor(elapsed / 100), 10);
            let percentage = ((availablePoints - 10) / (100 - 10)) * 100;
            document.getElementById("points-bar").style.width = percentage + "%";
        }, 100);

        // Attach event listeners for each word
        const clickableWords = document.querySelectorAll(".clickable-word");
        clickableWords.forEach((wordElement) => {
            wordElement.addEventListener("click", () => {
                this.handleWordClick(wordElement, currentSentence);
            });
        });
    } else {
        this.endGame();
    }
}

    handleWordClick(wordElement, currentSentence) {
        // Clear the points progress bar update interval for click phase
        if (this.pointsInterval) {
            clearInterval(this.pointsInterval);
            this.pointsInterval = null;
        }
        const clickedWord = wordElement.textContent;
        // Remove all non-word characters (except whitespace), trim, and convert to lowercase
        const cleanedClickedWord = clickedWord.replace(/[^\w\s]|_/g, "").trim().toLowerCase();
        const cleanedErrorWord = currentSentence.errorWord.replace(/[^\w\s]|_/g, "").trim().toLowerCase();
        const clickTime = Date.now() - this.startClickTime;
        // If in review mode, do not update the score.
        if (this.reviewMode) {
            if (cleanedClickedWord === cleanedErrorWord) {
                wordElement.style.color = 'green';
            } else {
                wordElement.style.color = 'red';
            }
            // Highlight the correct word in green
            const correctWordElements = document.querySelectorAll('.clickable-word');
            correctWordElements.forEach((element) => {
                if (element.textContent.replace(/[^\w\s]|_/g, "").trim().toLowerCase() === cleanedErrorWord) {
                    element.style.color = 'green';
                }
            });
            // Remove event listeners (so the player can't click again)
            const clickableWords = document.querySelectorAll(".clickable-word");
            clickableWords.forEach((element) => {
                element.removeEventListener("click", () => {
                    this.handleWordClick(element, currentSentence);
                });
            });
            // Move to the correction phase without updating score.
            this.selectErrorWord(clickedWord);
            return;
        }
        // Normal game mode: process clicks and update score.
        if (cleanedClickedWord === cleanedErrorWord) {
            // Correct click: calculate and add positive score
            let clickScore = Math.max(100 - Math.floor(clickTime / 100), 10); // Max 100, min 10
            this.score = (this.score || 0) + clickScore;
            wordElement.style.color = 'green';  // Correct word (green)
        } else {
            // Incorrect click: subtract penalty points
            this.score = (this.score || 0) - 50;
            wordElement.style.color = 'red';  // Incorrect word (red)
            // Save the mistake if not already saved
            if (!this.wrongAnswers.includes(currentSentence)) {
                this.wrongAnswers.push(currentSentence);
            }
        }
        document.getElementById("score").textContent = this.score; // Update the score display
        // Highlight the correct word in green by cleaning its text as well
        const correctWordElements = document.querySelectorAll('.clickable-word');
        correctWordElements.forEach((element) => {
            if (element.textContent.replace(/[^\w\s]|_/g, "").trim().toLowerCase() === cleanedErrorWord) {
                element.style.color = 'green';
            }
        });
        // Disable further clicks by removing event listeners
        const clickableWords = document.querySelectorAll(".clickable-word");
        clickableWords.forEach((element) => {
            element.removeEventListener("click", () => {
                this.handleWordClick(element, currentSentence);
            });
        });

        // **Prevent any more clicks on this sentence**
        document.getElementById("sentence").style.pointerEvents = "none";

        // Move to the correction phase
        this.selectErrorWord(clickedWord);
    }

    selectErrorWord(word) {
        this.currentErrorWord = word;
        document.getElementById("feedback").textContent = `You selected "${word}". Now, type the correction.`;
        // Clear any previous points interval (just in case)
        if (this.pointsInterval) {
            clearInterval(this.pointsInterval);
            this.pointsInterval = null;
        }
        // Start the correction timer and update the points bar for correction phase
        this.startCorrectionTime = Date.now();
        document.getElementById("points-bar").style.width = "100%";
        this.pointsInterval = setInterval(() => {
            let elapsed = Date.now() - this.startCorrectionTime;
            let availablePoints = Math.max(100 - Math.floor(elapsed / 100), 10);
            let percentage = ((availablePoints - 10) / (100 - 10)) * 100;
            document.getElementById("points-bar").style.width = percentage + "%";
        }, 100);
        document.getElementById("answer").focus();
    }

    checkAnswer() {
        // Prevent submission if no error word was selected
        if (!this.currentErrorWord) {
            document.getElementById("feedback").textContent = "Please click on the incorrect word first!";
            return;
        }
        // Clear the points progress bar update interval for correction phase
        if (this.pointsInterval) {
            clearInterval(this.pointsInterval);
            this.pointsInterval = null;
        }
        // Stop if the game isn't active
        if (!this.gameActive && !this.reviewMode) return;
        const input = document.getElementById("answer");
        const userInput = input.value.trim().toLowerCase();
        const currentSet = this.reviewMode ? this.wrongAnswers : this.sentences;
        const currentSentence = currentSet[this.currentIndex];
        const correctionTime = Date.now() - this.startCorrectionTime; // Time taken for correction
        // Handle multiple or single correct answers
        let possibleAnswers = currentSentence.correctAnswer;
        if (!Array.isArray(possibleAnswers)) {
            possibleAnswers = [possibleAnswers];
        }
        // Convert all possible answers to lowercase for comparison
        possibleAnswers = possibleAnswers.map(answer => answer.toLowerCase());
        // If we are in review mode, don't modify the score.
        if (this.reviewMode) {
            if (possibleAnswers.includes(userInput)) {
                input.classList.add("correct");
                document.getElementById("feedback").textContent = 
                    `Correct. The answer is: ${possibleAnswers.join(" / ")}`;
                setTimeout(() => {
                    input.classList.remove("correct");
                    input.value = ""; // Clear input after delay
                    this.currentIndex++;
                    this.currentErrorWord = null; // Reset so next sentence requires a click
                    this.updateSentence();
                }, 1000);
            } else {
                input.classList.add("incorrect");
                document.getElementById("feedback").textContent = 
                    `Incorrect. The correct answer is: ${possibleAnswers.join(" / ")}`;
                setTimeout(() => {
                    input.classList.remove("incorrect");
                    input.value = ""; // Clear input after delay
                    this.currentIndex++;
                    this.currentErrorWord = null;
                    this.updateSentence();
                }, 1000);
            }
            return;
        }
        // Normal game mode: process answer and update score.
        if (possibleAnswers.includes(userInput)) {
            // === Correct ===
            let correctionScore = Math.max(100 - Math.floor(correctionTime / 100), 10); // Max 100, min 10
            this.score = (this.score || 0) + correctionScore;
            document.getElementById("score").textContent = this.score;
            input.classList.add("correct");
            document.getElementById("feedback").textContent = 
                `Correct. The answer is: ${possibleAnswers.join(" / ")}`;
            setTimeout(() => {
                input.classList.remove("correct");
                input.value = ""; // Clear input after delay
                this.currentIndex++;
                this.currentErrorWord = null;
                this.updateSentence();
            }, 1000);
        } else {
            // === Incorrect ===
            this.score = (this.score || 0) - 50;
            // Save the mistake along with the student's answer (if not already saved)
            if (!this.wrongAnswers.some(item => item.sentence === currentSentence.sentence)) {
                this.wrongAnswers.push({
                    sentence: currentSentence.sentence,
                    errorWord: currentSentence.errorWord,
                    correctAnswer: currentSentence.correctAnswer,
                    studentAnswer: userInput
                });
            }
            document.getElementById("score").textContent = this.score;
            input.classList.add("incorrect");
            document.getElementById("feedback").textContent = 
                `Incorrect. The correct answer is: ${possibleAnswers.join(" / ")}`;
            setTimeout(() => {
                input.classList.remove("incorrect");
                input.value = ""; // Clear input after delay
                this.currentIndex++;
                this.currentErrorWord = null;
                this.updateSentence();
            }, 1000);
        }
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timer > 0) {
                this.timer--;
                document.getElementById("timer").textContent = `Time left: ${this.timer}s`;
                document.getElementById("timer-bar").style.width = (this.timer / 120) * 100 + "%";
            } else {
                clearInterval(this.interval);
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.interval);
        // Show a final message with the final score
        document.getElementById("feedback").textContent = `Game Over! Final Score: ${this.score}`;
        // Show the Restart button
        document.getElementById("restart").style.display = "block";
        // If there are any mistakes, show the Review button and the Download Report button
        if (this.wrongAnswers.length > 0) {
            document.getElementById("review").style.display = "block";
            // Create and display the Download Report button if it doesn't exist
            let downloadBtn = document.getElementById("downloadReport");
            if (!downloadBtn) {
                downloadBtn = document.createElement("button");
                downloadBtn.id = "downloadReport";
                downloadBtn.textContent = "Download Report";
                document.getElementById("game-container").appendChild(downloadBtn);
                downloadBtn.addEventListener("click", () => this.downloadReport());
            } else {
                downloadBtn.style.display = "block";
            }
        }
    }

    restartGame() {
        this.gameActive = false;
        this.reviewMode = false;
        clearInterval(this.interval);
        this.currentIndex = 0;
        this.score = 0;
        this.timer = 120;
        this.wrongAnswers = [];
        this.sentences = this.shuffle([...this.originalSentences]);
        document.getElementById("score").textContent = this.score;
        document.getElementById("feedback").textContent = "";
        document.getElementById("sentence").textContent = "";
        document.getElementById("answer").value = "";
        document.getElementById("timer").textContent = "Time left: 120s";
        document.getElementById("timer-bar").style.width = "100%";
        document.getElementById("review").style.display = "none";
        document.getElementById("restart").style.display = "none";
        document.getElementById("start").style.display = "block";
    }

    downloadReport() {
        let report = "Mistakes Report\n\n";
        this.wrongAnswers.forEach((item, index) => {
            // If correctAnswer is an array, join the options; otherwise, use it directly.
            let correct = Array.isArray(item.correctAnswer) ? item.correctAnswer.join(" / ") : item.correctAnswer;
            report += `Mistake ${index + 1}:\nSentence: ${item.sentence}\nError Word: ${item.errorWord}\nYour Answer: ${item.studentAnswer}\nCorrect Answer: ${correct}\n\n`;
        });
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.txt";
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Sample sentences for testing
const sentences = [
    { 
        sentence: "It depends of the person.", 
        errorWord: "of",
        correctAnswer: "on"
    },
    { 
        sentence: "There is too much air contamination in Madrid.", 
        errorWord: "contamination",
        correctAnswer: "pollution"
    },
    { 
        sentence: "I went to a bar last night but it was almost empty. There were little people there.", 
        errorWord: "little",
        correctAnswer: "few"
    },
    { 
        sentence: "I couldn’t assist the meeting.", 
        errorWord: "assist",
        correctAnswer: "attend"
    },
    { 
        sentence: "Today’s class was very bored.", 
        errorWord: "bored",
        correctAnswer: "boring"
    },
    { 
        sentence: "Actually, I’m working in a travel agent’s.", 
        errorWord: "actually",
        correctAnswer: "currently"
    },
    { 
        sentence: "Don’t shout at him. He’s very sensible.", 
        errorWord: "sensible",
        correctAnswer: "sensitive"
    },
    { 
        sentence: "She presented me to her friend Bea.", 
        errorWord: "presented",
        correctAnswer: "introduced"
    },
    { 
        sentence: "I don’t have no money.", 
        errorWord: "no",
        correctAnswer: "any"
    },
    { 
        sentence: "She gave me some good advices.", 
        errorWord: "advices",
        correctAnswer: "advice"
    },
    { 
        sentence: "I did a big effort.", 
        errorWord: "did",
        correctAnswer: "made"
    },
    { 
        sentence: "It’s an important amount of material.", 
        errorWord: "important",
        correctAnswer: ["significant", "considerable"]
    },
    {
        sentence: "I’m thinking in buying a new car.",
        errorWord: "in",
        correctAnswer: ["about", "of"]
    },
    {
        sentence: "The exam consists in 5 different papers.",
        errorWord: "in",
        correctAnswer: "of"
    },
    {
        sentence: "It was a real deception when I failed the exam.",
        errorWord: "deception",
        correctAnswer: "disappointment"
    },
    {
        sentence: "My favourite travel was when I went to Thailand.",
        errorWord: "travel",
        correctAnswer: "trip"
    },
    {
        sentence: "He’s absolutely compromised to the company’s goals.",
        errorWord: "compromised",
        correctAnswer: "committed"
    },
    {
        sentence: "This is your final advice! Don’t be late again.",
        errorWord: "advice",
        correctAnswer: "warning"
    },
    {
        sentence: "If you approve this final test, you’ll get the job.",
        errorWord: "approve",
        correctAnswer: "pass"
    },
    {
        sentence: "Could you give me the direction for the new offices?",
        errorWord: "direction",
        correctAnswer: "address"
    },
    {
        sentence: "They got very bad notes in their exams.",
        errorWord: "notes",
        correctAnswer: ["marks", "grades"]
    },
    {
        sentence: "You shouldn’t talk to the bus conductor while she’s driving.",
        errorWord: "conductor",
        correctAnswer: "driver"
    },
    {
        sentence: "We stayed in a camping, but it was dirty and overcrowded.",
        errorWord: "camping",
        correctAnswer: ["campsite", "camp site"]
    },
    {
        sentence: "Is there a public parking near here?",
        errorWord: "parking",
        correctAnswer: ["car park", "parking lot"]
    },
    {
        sentence: "Were you expecting to see him there or was it just a casualty?",
        errorWord: "casualty",
        correctAnswer: "coincidence"
    },
    {
        sentence: "I really can’t support people like that!",
        errorWord: "support",
        correctAnswer: "stand"
    },
    {
        sentence: "I don’t eat jam because I’m a vegetarian.",
        errorWord: "jam",
        correctAnswer: "ham"
    },
    {
        sentence: "I always take a coffee before going to work.",
        errorWord: "take",
        correctAnswer: ["have", "drink"]
    },
    {
        sentence: "That was a very long history.",
        errorWord: "history",
        correctAnswer: "story"
    },
    {
        sentence: "It was a very tired journey.",
        errorWord: "tired",
        correctAnswer: "tiring"
    },
    {
        sentence: "I have afraid of spiders.",
        errorWord: "have",
        correctAnswer: "am"
    },
    {
        sentence: "I had lucky to get the job.",
        errorWord: "had",
        correctAnswer: "was"
    },
    {
        sentence: "People is always telling me that.",
        errorWord: "is",
        correctAnswer: "are"
    },
    {
        sentence: "I organized a big party but anybody came.",
        errorWord: "anybody",
        correctAnswer: ["nobody", "no one"]
    },
    {
        sentence: "I have a carpet here with all the relevant documents.",
        errorWord: "carpet",
        correctAnswer: "folder"
    },
    {
        sentence: "She’s responsible of training new employees.",
        errorWord: "of",
        correctAnswer: "for"
    },
    {
        sentence: "At the moment, I’m unemployment, but I’m looking for a job.",
        errorWord: "unemployment",
        correctAnswer: "unemployed"
    },
    {
        sentence: "My wife and I often discuss about stupid things.",
        errorWord: "discuss",
        correctAnswer: "argue"
    },
    {
        sentence: "You can’t avoid me from seeing my friends.",
        errorWord: "avoid",
        correctAnswer: ["prevent", "stop"]
    },
    {
        sentence: "I wish it doesn’t rain during your holiday!",
        errorWord: "wish",
        correctAnswer: "hope"
    },
    {
        sentence: "Atleti won Real Madrid last night.",
        errorWord: "won",
        correctAnswer: "beat"
    },
    {
    sentence: "I’ll have a shower before go out.",
    errorWord: "go",
    correctAnswer: "going"
  },
  {
    sentence: "Sarah doesn’t think he’s coming today but I think yes.",
    errorWord: "yes",
    correctAnswer: "so"
  },
  {
    sentence: "For a long and healthy life, it’s important to practise sport regularly.",
    errorWord: "practise",
    correctAnswer: "do"
  },
  {
    sentence: "The factory needs to contract more staff over the summer.",
    errorWord: "contract",
    correctAnswer: ["hire", "employ", "take on"]
  },
  {
    sentence: "I’ve never been in London, but I would really like to go.",
    errorWord: "in",
    correctAnswer: "to"
  },
  {
    sentence: "Don’t put attention to anything they say.",
    errorWord: "put",
    correctAnswer: "pay"
  },
  {
    sentence: "He’s talking with the phone right now.",
    errorWord: "with",
    correctAnswer: "on"
  },
  {
    sentence: "The flight was cancelled for the weather.",
    errorWord: "for",
    correctAnswer: ["because of", "due to"]
  },
  {
    sentence: "I have known them since seven years.",
    errorWord: "since",
    correctAnswer: "for"
  },
  {
    sentence: "I don’t know how it is called.",
    errorWord: "how",
    correctAnswer: "what"
  },
  {
    sentence: "I have a doubt about this.",
    errorWord: "doubt",
    correctAnswer: "question"
  },
  {
    sentence: "I have a lot of homeworks.",
    errorWord: "homeworks",
    correctAnswer: "homework"
  },
  {
    sentence: "She’s very good in maths.",
    errorWord: "in",
    correctAnswer: "at"
  },
  {
    sentence: "They remembered me of my cousins.",
    errorWord: "remembered",
    correctAnswer: "remind"
  },
  {
    sentence: "She’s married with an Ethiopian man.",
    errorWord: "with",
    correctAnswer: "to"
  },
  {
    sentence: "I like going to a disco at the weekend.",
    errorWord: "disco",
    correctAnswer: "club"
  },
  {
    sentence: "He’s so educated—He always treats everybody with a lot of respect.",
    errorWord: "educated",
    correctAnswer: "polite"
  },
  {
    sentence: "He needs to go to university because he pretends to be a doctor.",
    errorWord: "pretends",
    correctAnswer: ["intends", "wants to", "hopes"]
  },
  {
    sentence: "The noise from the neighbour’s house is molesting me.",
    errorWord: "molesting",
    correctAnswer: ["bothering", "annoying", "disturbing"]
  },
  {
    sentence: "I liked the movie, but it was a little large for me.",
    errorWord: "large",
    correctAnswer: "long"
  }
];

const game = new SpanglishFixitGame(sentences);
