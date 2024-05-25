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
    } else if (isBoardFull(board)) {
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
    const move = nextMove(board, currentPlayer);
    board[move] = currentPlayer;
    gameBoard.children[move].innerText = currentPlayer;

    if (checkWin(board, currentPlayer)) {
        endGame(`${currentPlayer} wins!`);
    } else if (isBoardFull(board)) {
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

    if (message.includes('wins')) {
        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            const symbol = board[a];
            const isWinningPattern = symbol !== '' && board[b] === symbol && board[c] === symbol;

            if (isWinningPattern) {
                const winningCells = [gameBoard.children[a], gameBoard.children[b], gameBoard.children[c]];
                winningCells.forEach(cell => {
                    cell.classList.add('winning-pattern');
                });

                setTimeout(() => {
                    winningCells.forEach(cell => {
                        cell.classList.remove('winning-pattern');
                    });
                }, 800);
            }
        });
    }
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

// Helper functions for the nextMove algorithm
function checkWin(board, player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winConditions.some(combination =>
        combination.every(cell => board[cell] === player)
    );
}

function isBoardFull(board) {
    return board.every(cell => cell !== '');
}

function emptySquares(board) {
    return board.reduce((empty, cell, index) => {
        if (cell === '') empty.push(index);
        return empty;
    }, []);
}

function copyBoard(board) {
    return board.slice();
}

function simulateMove(board, index, player) {
    const newBoard = copyBoard(board);
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
    if (board[4] === '') {
        return 4;
    }
    return -1;
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
    const emptyCorner = corners.find(corner => board[corner] === '');
    return emptyCorner !== undefined ? emptyCorner : -1;
}

function findEmptySide(board) {
    const sides = [1, 3, 5, 7];
    const emptySide = sides.find(side => board[side] === '');
    return emptySide !== undefined ? emptySide : -1;
}

function nextMove(board, player) {
    const availableMoves = emptySquares(board);

    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        const newBoard = simulateMove(board, move, player);
        if (checkWin(newBoard, player)) {
            return move;
        }
    }

    const opponent = (player === 'X') ? 'O' : 'X';
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        const newBoard = simulateMove(board, move, opponent);
        if (checkWin(newBoard, opponent)) {
            return move;
        }
    }

    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        if (createsFork(board, player, move)) {
            return move;
        }
    }

    let move = findCenter(board);
    if (move !== -1) return move;

    const opponentCorners = [0, 2, 6, 8].filter(corner => board[corner] === opponent);
    for (let i = 0; i < opponentCorners.length; i++) {
        move = findOppositeCorner(board, opponentCorners[i]);
        if (move !== -1) return move;
    }

    move = findEmptyCorner(board);
    if (move !== -1) return move;

    move = findEmptySide(board);
    if (move !== -1) return move;

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}
