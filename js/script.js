const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');

context.scale(20, 20);
nextContext.scale(20, 20);

const pieces = [
    {
        shape: [[1, 1, 1, 1]],
        color: 'cyan'
    },
    {
        shape: [[0, 0, 1], [1, 1, 1]],
        color: 'blue'
    },
    {
        shape: [[1, 0, 0], [1, 1, 1]],
        color: 'orange'
    },
    {
        shape: [[1, 1], [1, 1]],
        color: 'yellow'
    },
    {
        shape: [[0, 1, 1], [1, 1, 0]],
        color: 'green'
    },
    {
        shape: [[0, 1, 0], [1, 1, 1]],
        color: 'purple'
    },
    {
        shape: [[1, 1, 0], [0, 1, 1]],
        color: 'red'
    }
];

let board = Array.from({ length: 20 }, () => Array(12).fill(0));
let currentPiece;
let currentPosition;
let nextPiece;
let score = 0;

function resetGame() {
    board = Array.from({ length: 20 }, () => Array(12).fill(0));
    score = 0;
    updateScore();
    newPiece();
}

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'white';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
    drawPiece();
}

function drawPiece() {
    currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) {
                const x = currentPosition.x + dx;
                const y = currentPosition.y + dy;
                context.fillStyle = currentPiece.color;
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function drawNextPiece() {
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextContext.fillStyle = nextPiece.color;
                nextContext.fillRect(x, y, 1, 1);
            }
        });
    });
}

function newPiece() {
    currentPiece = nextPiece || pieces[Math.floor(Math.random() * pieces.length)];
    nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
    drawNextPiece();
    currentPosition = { x: Math.floor((12 - currentPiece.shape[0].length) / 2), y: 0 };
    if (collides()) {
        resetGame();
    }
}

function collides() {
    return currentPiece.shape.some((row, dy) => {
        return row.some((value, dx) => {
            if (value) {
                const x = currentPosition.x + dx;
                const y = currentPosition.y + dy;
                return y < 0 || x < 0 || x >= 12 || y >= 20 || board[y][x];
            }
            return false;
        });
    });
}

function merge() {
    currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) {
                board[currentPosition.y + dy][currentPosition.x + dx] = 1;
            }
        });
    });
}

function clearRows() {
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(value => value)) {
            board.splice(y, 1);
            board.unshift(Array(12).fill(0));
            score += 100;
            updateScore();
            y++;
        }
    }
}

function updateScore() {
    document.getElementById('score').innerText = `Pontuação: ${score}`;
}

function drop() {
    currentPosition.y++;
    if (collides()) {
        currentPosition.y--;
        merge();
        clearRows();
        newPiece();
    }
    drawBoard();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            currentPosition.x--;
            if (collides()) currentPosition.x++;
            break;
        case 'ArrowRight':
            currentPosition.x++;
            if (collides()) currentPosition.x--;
            break;
        case 'ArrowDown':
            drop();
            break;
        case 'ArrowUp':
            const rotatedPiece = currentPiece.shape[0].map((_, index) =>
                currentPiece.shape.map(row => row[index]).reverse()
            );
            currentPiece.shape = rotatedPiece;
            if (collides()) {
                const revertedPiece = currentPiece.shape[0].map((_, index) =>
                    currentPiece.shape.map(row => row[index]).reverse()
                );
                currentPiece.shape = revertedPiece;
            }
            break;
    }
    drawBoard();
});

resetGame();
setInterval(drop, 1000);
