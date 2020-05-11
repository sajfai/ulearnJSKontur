const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const dimension = 3;
let turnCount = 0;
let board = [];

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame() {
    renderGrid(dimension);
    board = renderArr(dimension);
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function renderArr(dimension) {
    let arr = [];
    for (let i = 0; i < dimension; i++) {
        arr[i] = [];
        for (let j = 0; j < dimension; j++) {
            arr[i][j] = EMPTY;
        }
    }
    return arr;
}


function cellClickHandler(row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (board[row][col] != EMPTY) {
        console.log(`Cell ${row}, ${col} already marked!`);
        return;
    }
    turnCount++;
    if (turnCount % 2 === 0) {
        renderSymbolInCell(ZERO, row, col);
        board[row][col] = ZERO;
    } else {
        renderSymbolInCell(CROSS, row, col);
        board[row][col] = CROSS;
    }
    setTimeout(() => checkBoardIsFull(board), 500);
    alertWinner(board);
}

function checkBoardIsFull(board) {
    let emptyCell = false;
    for (let row of board) {
        for (let cell of row) {
            emptyCell = cell === EMPTY;
            if (emptyCell) return;
        }
    }
    if (!emptyCell)
        alert('Победила дружба!');
}

function unique(arr) { return Array.from(new Set(arr)); }

function getWinner(board) {
    const winnerByRows = getWinnerByRows(board);
    const winnerByCols = getWinnerByCols(board);
    const winnerByDiags = getWinnerByDiags(board);
    const results = [winnerByRows, winnerByCols, winnerByDiags];
    return mergeWinners(results);
}

function alertWinner(board) {
    const winner = getWinner(board);
    if (winner !== EMPTY)
        alert(getWinner(board));
}

function getWinnerByRows(board) {
    return mergeWinners(board.map(getWinnerByRow));
}

function getWinnerByRow(row) {
    return unique(row).length === 1 ? unique(row)[0] : EMPTY;
}

function transpone(board) {
    const t = [];
    for (let j = 0; j < dimension; j++) {
        t[j] = [];
    }
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            t[j][i] = board[i][j];
        }
    }
    return t;
}


function getDiag1(board) {
    const d = [];
    for (let i = 0; i < dimension; i++) {
        d[i] = board[i][i];
    }
    return d;
}

function getDiag2(board) {
    const d = [];
    for (let i = 0; i < dimension; i++) {
        d[i] = board[i][dimension - i - 1];
    }
    return d;
}

function getWinnerByCols(board) {
    const transponed = transpone(board);
    return mergeWinners(transponed.map(getWinnerByRow));
}


function getWinnerByDiags(board) {
    const winner1 = getWinnerByRow(getDiag1(board));
    const winner2 = getWinnerByRow(getDiag2(board));
    return mergeWinners([winner1, winner2]);
}

function mergeWinners(winners) {
    const results = unique(winners);
    if (results.length === 3) {
        throw new Error("Все три разных!");
    }
    return results.filter(x => x !== EMPTY).length === 0 ? EMPTY : results.filter(x => x !== EMPTY)[0];
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    console.log('reset!');
    startGame();
}


/* Test Function */
/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
