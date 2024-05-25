let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isSinglePlayer = false;
let isComputerMoving = false;

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

    if (checkWin(board, currentPlayer)) {
        endGame(`${currentPlayer} wins!`);
    } else if (checkDraw()) {
        endGame('Draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerText = `${currentPlayer}'s turn`;

        if (isSinglePlayer && currentPlayer === 'O') {
            isComputerMoving = true;
            setTimeout(computerMove, 1000);
        }
    }
}

function computerMove() {
    const bestMove = nextMove(board, currentPlayer);
    board[bestMove] = currentPlayer;
    gameBoard.children[bestMove].innerText = currentPlayer;

    if (checkWin(board, currentPlayer)) {
        endGame(`${currentPlayer} wins!`);
    } else if (checkDraw()) {
        endGame('Draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerText = `${currentPlayer}'s turn`;
    }

    isComputerMoving = false;
}

function endGame(message) {
    statusDisplay.innerText = message;
    gameActive = false;

    if (message === 'Draw!') {
        Array.from(gameBoard.children).forEach(cell => {
            cell.classList.add('draw-pattern');
        });
    } else if (message.includes('wins')) {
        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            if (board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer) {
                [gameBoard.children[a], gameBoard.children[b], gameBoard.children[c]].forEach(cell => {
                    cell.classList.add('winning-pattern');
                });
            }
        });
    }
}

function checkWin(board, player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return board[index] === player;
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
        cell.classList.remove('draw-pattern');
        cell.classList.remove('winning-pattern');
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

/* AI Helper Functions */
function emptySquares(board) {
    return board.reduce((empty, cell, index) => {
        if (cell === '') empty.push(index);
        return empty;
    }, []);
}

function simulateMove(board, index, player) {
    const newBoard = board.slice();
    newBoard[index] = player;
    return newBoard;
}

function createsFork(board, player, move) {
    const newBoard = simulateMove(board, move, player);
    const availableMoves = emptySquares(newBoard);
    
    let count = 0;
    for (let i = 0; i < availableMoves.length; i++) {
        const potentialMove = availableMoves[i];
        const forkBoard = simulateMove(newBoard, potentialMove, player);
        if (checkWin(forkBoard, player)) {
            count++;
            if (count >= 2) {
                return true;
            }
        }
    }
    return false;
}

function findCenter(board) {
    return board[4] === '' ? 4 : -1;
}

function findOppositeCorner(board, corner) {
    const oppositeCorners = [[0, 8], [2, 6], [6, 2], [8, 0]];
    const oppositeCorner = oppositeCorners.find(pair =>
        board[pair[0]] === '' && corner === pair[1]
    );
    return oppositeCorner ? oppositeCorner[0] : -1;
}

function findEmptyCorner(board) {
    const corners = [0, 2, 6, 8];
    return corners.find(corner => board[corner] === '') ?? -1;
}

function findEmptySide(board) {
    const sides = [1, 3, 5, 7];
    return sides.find(side => board[side] === '') ?? -1;
}

function nextMove(board, player) {
    const availableMoves = emptySquares(board);
    const opponent = player === 'X' ? 'O' : 'X';

    for (const move of availableMoves) {
        if (checkWin(simulateMove(board, move, player), player)) {
            return move;
        }
    }

    for (const move of availableMoves) {
        if (checkWin(simulateMove(board, move, opponent), opponent)) {
            return move;
        }
    }

    for (const move of availableMoves) {
        if (createsFork(board, player, move)) {
            return move;
        }
    }

    let move = findCenter(board);
    if (move !== -1) return move;

    const opponentCorners = [0, 2, 6, 8].filter(corner => board[corner] === opponent);
    for (const corner of opponentCorners) {
        move = findOppositeCorner(board, corner);
        if (move !== -1) return move;
    }

    move = findEmptyCorner(board);
    if (move !== -1) return move;

    move = findEmptySide(board);
    if (move !== -1) return move;

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}
