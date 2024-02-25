let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

const gameBoard = document.getElementById('gameBoard');
const statusDisplay = document.getElementById('status');

function handleMove(cellIndex) {
    if (!gameActive || board[cellIndex] !== '') return;

    board[cellIndex] = currentPlayer;
    gameBoard.children[cellIndex].innerText = currentPlayer;
    if (checkWin()) {
        statusDisplay.innerText = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    if (checkDraw()) {
        statusDisplay.innerText = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerText = `${currentPlayer}'s turn`;
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
    Array.from(gameBoard.children).forEach(cell => cell.innerText = '');
}
function handleMove(cellIndex) {
    if (!gameActive || board[cellIndex] !== '') return;

    board[cellIndex] = currentPlayer;
    gameBoard.children[cellIndex].innerText = currentPlayer;
    if (checkWin()) {
        statusDisplay.innerText = `${currentPlayer} wins!`;
        gameActive = false;
        // Apply strike animation to winning cells
        applyStrikeAnimation();
        return;
    }
    if (checkDraw()) {
        statusDisplay.innerText = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerText = `${currentPlayer}'s turn`;
}

function applyStrikeAnimation() {
    winPatterns.forEach(pattern => {
        const [a, b, c] = pattern;
        const cells = gameBoard.children;

        const symbol = board[a]; // Get the symbol (X or O) of the first cell in the pattern
        const isWinningPattern = symbol !== '' && board[b] === symbol && board[c] === symbol;

        if (isWinningPattern) {
            cells[a].classList.add('winning-pattern');
            cells[b].classList.add('winning-pattern');
            cells[c].classList.add('winning-pattern');
        }
    });
}





function resetGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    statusDisplay.innerText = `${currentPlayer}'s turn`;
    Array.from(gameBoard.children).forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('strike');
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



