let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isSinglePlayer = false;
let isComputerMoving = false; // Flag to indicate if computer is making a move

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const gameBoard = document.getElementById('gameBoard');
const statusDisplay = document.getElementById('status');
const modeSelection = document.getElementById('modeSelection');
const resetButton = document.getElementById('resetButton');
const backButton = document.getElementById('backButton');

function selectMode(mode) {
    isSinglePlayer = (mode === 'single');
    modeSelection.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    statusDisplay.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    backButton.classList.remove('hidden');
    statusDisplay.innerText = `${currentPlayer}'s turn`;
}

function handleMove(cellIndex) {
    if (!gameActive || board[cellIndex] !== '' || isComputerMoving) return;

    board[cellIndex] = currentPlayer;
    gameBoard.children[cellIndex].innerText = currentPlayer;

    if (checkWin()) {
        endGame(`${currentPlayer} wins!`);
    } else if (checkDraw()) {
        endGame('Draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerText = `${currentPlayer}'s turn`;

        if (isSinglePlayer && currentPlayer === 'O') {
            isComputerMoving = true; // Set flag to indicate computer is making a move
            setTimeout(computerMove, 1000);
        }
    }
}

function computerMove() {
    let emptyCells = [];
    board.forEach((cell, index) => {
        if (cell === '') {
            emptyCells.push(index);
        }
    });

    if (emptyCells.length === 0) return; // No empty cells left

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const moveIndex = emptyCells[randomIndex];

    board[moveIndex] = currentPlayer;
    gameBoard.children[moveIndex].innerText = currentPlayer;

    if (checkWin()) {
        endGame(`${currentPlayer} wins!`);
    } else if (checkDraw()) {
        endGame('Draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerText = `${currentPlayer}'s turn`;
    }

    isComputerMoving = false; // Reset flag after computer's move
}

function endGame(message) {
    statusDisplay.innerText = message;
    gameActive = false;

    // Apply strike animation to winning cells
    if (message.includes('wins')) {
        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            const symbol = board[a];
            const isWinningPattern = symbol !== '' && board[b] === symbol && board[c] === symbol;

            if (isWinningPattern) {
                const winningCells = [gameBoard.children[a], gameBoard.children[b], gameBoard.children[c]];
                winningCells.forEach(cell => {
                    cell.innerText = symbol; // Ensure the winning symbol is displayed
                    cell.classList.add('winning-pattern');
                });

                // Remove winning-pattern class after a short delay
                setTimeout(() => {
                    winningCells.forEach(cell => {
                        cell.classList.remove('winning-pattern');
                    });
                }, 800);
            }
        });
    }
}






function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function resetGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    statusDisplay.innerText = `${currentPlayer}'s turn`;
    Array.from(gameBoard.children).forEach(cell => {
        cell.innerText = '';
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }
}

function goBack() {
    gameBoard.classList.add('hidden');
    statusDisplay.classList.add('hidden');
    resetButton.classList.add('hidden');
    backButton.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    resetGame();
}

