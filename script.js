const puzzleContainer = document.getElementById("puzzle-container");
const shuffleButton = document.getElementById("shuffle-button");
const timeDisplay = document.getElementById("time");
const message = document.getElementById("message");

let tiles = Array.from({ length: 15 }, (_, i) => i + 1); // 1 to 15
tiles.push(null); // Represent the empty tile
let timer = null; // Timer interval
let startTime = null; // Start time
let gameStarted = false; // Track if the game has started

// Render the puzzle
function renderPuzzle() {
  puzzleContainer.innerHTML = "";
  tiles.forEach((tile, index) => {
    const tileDiv = document.createElement("div");
    tileDiv.className = "tile";
    if (tile === null) {
      tileDiv.classList.add("empty");
    } else {
      tileDiv.textContent = tile;
      tileDiv.addEventListener("click", () => moveTile(index));
    }
    puzzleContainer.appendChild(tileDiv);
  });
}

// Shuffle tiles
function shuffleTiles() {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  message.textContent = "";
  stopTimer(); // Reset the timer
  gameStarted = false; // Reset the game state
  timeDisplay.textContent = "0"; // Reset time display
  renderPuzzle();
}

// Move tile
function moveTile(index) {
  const emptyIndex = tiles.indexOf(null);
  const validMoves = [index - 1, index + 1, index - 4, index + 4];

  if (validMoves.includes(emptyIndex)) {
    if (!gameStarted) {
      startTimer(); // Start timer on first move
      gameStarted = true; // Mark game as started
    }
    [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
    renderPuzzle();
    if (isSolved()) {
      stopTimer();
      displayWinMessage();
    }
  }
}

// Check if the puzzle is solved
function isSolved() {
  return tiles.slice(0, 15).every((tile, i) => tile === i + 1);
}

// Timer functions
function startTimer() {
  startTime = Date.now();
  clearInterval(timer);
  timer = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = elapsedTime;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// Display winning message in a new tab
function displayWinMessage() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const winMessage = `Congratulations! You solved the puzzle in ${elapsedTime} seconds!`;
  const newTab = window.open("", "_blank");
  newTab.document.write(`
    <html>
      <head>
        <title>Puzzle Solved!</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background: linear-gradient(135deg, #34e89e, #0f3443);
            color: white;
            margin-top: 20%;
          }
          h1 {
            font-size: 2.5rem;
          }
          p {
            font-size: 1.5rem;
          }
        </style>
      </head>
      <body>
        <h1>Sliding Puzzle Game</h1>
        <p>${winMessage}</p>
      </body>
    </html>
  `);
}

// Initialize the puzzle
shuffleButton.addEventListener("click", shuffleTiles);
shuffleTiles();
