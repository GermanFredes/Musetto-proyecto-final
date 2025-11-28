const N = 9; 
let tableroInicial = []; 
let tableroActual = [];  

function inicializarGrid() {
    const gridDiv = document.getElementById('sudoku-grid');
    gridDiv.innerHTML = ''; 

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;
            input.addEventListener('input', manejarInputUsuario);
            input.addEventListener('keydown', permitirSoloNumeros); 
            
            cell.appendChild(input);
            gridDiv.appendChild(cell);
        }
    }
}

function generarSudoku() {
    const mensajeP = document.getElementById('mensaje');
    mensajeP.textContent = 'Generando nuevo Sudoku...';
    
    let grid = Array(N).fill(null).map(() => Array(N).fill(0));

    if (fillGrid(grid)) {
        tableroInicial = grid.map(row => [...row]); 
        
        let puzzle = grid.map(row => [...row]);
        let numRemoved = 45; 
        
        while (numRemoved > 0) {
            let r = Math.floor(Math.random() * N);
            let c = Math.floor(Math.random() * N);

            if (puzzle[r][c] !== 0) {
                puzzle[r][c] = 0; 
                numRemoved--;
            }
        }
        tableroActual = puzzle.map(row => [...row]); 
        renderizarSudoku(tableroActual);
        mensajeP.textContent = '¡Sudoku generado! ¡A jugar!';
    } else {
        mensajeP.textContent = 'Error al generar Sudoku. Intenta de nuevo.';
    }
}

function fillGrid(grid) {
    let row = -1;
    let col = -1;
    let isEmpty = true;

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            if (grid[r][c] === 0) {
                row = r;
                col = c;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) break;
    }

    if (isEmpty) return true; 

    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums); 

    for (let num of nums) {
        if (esSeguro(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) {
                return true;
            } else {
                grid[row][col] = 0; 
            }
        }
    }
    return false; 
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function renderizarSudoku(board) {
    const gridDiv = document.getElementById('sudoku-grid');
    const cells = gridDiv.children;

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const cellIndex = r * N + c;
            const cell = cells[cellIndex];
            const input = cell.querySelector('input');
            
            input.value = board[r][c] !== 0 ? board[r][c] : '';
            input.classList.remove('fixed', 'user-input', 'incorrect', 'correct');

            if (tableroInicial[r][c] !== 0 && tableroInicial[r][c] === board[r][c]) {
                cell.classList.add('fixed');
                input.readOnly = true; 
            } else if (board[r][c] !== 0) {
                 cell.classList.add('user-input');
                 input.readOnly = false;
            } else {
                 input.readOnly = false;
            }
        }
    }
    document.getElementById('mensaje').textContent = '';
}

function manejarInputUsuario(event) {
    let input = event.target;
    let r = parseInt(input.dataset.row);
    let c = parseInt(input.dataset.col);
    let value = input.value.trim();

    input.value = value.replace(/[^1-9]/g, ''); 
    value = input.value; 

    tableroActual[r][c] = value !== '' ? parseInt(value) : 0;

    if (value !== '') {
        input.parentElement.classList.add('user-input');
    } else {
        input.parentElement.classList.remove('user-input');
    }
    input.parentElement.classList.remove('incorrect', 'correct');
}

function permitirSoloNumeros(event) {
    const key = event.key;
    if (!((key >= '1' && key <= '9') || 
          key === 'Backspace' || 
          key === 'Delete' || 
          key === 'Tab' ||
          key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown')) {
        event.preventDefault();
    }
}


function resetearSudoku() {
    if (tableroInicial.length === 0) {
        document.getElementById('mensaje').textContent = 'Primero genera un Sudoku.';
        return;
    }
    tableroActual = tableroInicial.map(row => [...row]); 
    renderizarSudoku(tableroActual);
    document.getElementById('mensaje').textContent = 'Sudoku reiniciado.';
}

function comprobarSudoku() {
    const mensajeP = document.getElementById('mensaje');
    const currentBoard = getCurrentBoardFromUI(); 

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('incorrect', 'correct'));

    let errores = 0;

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const num = currentBoard[r][c];
            if (num !== 0) {
                currentBoard[r][c] = 0; 
                if (!esSeguro(currentBoard, r, c, num)) {
                    cells[r * N + c].classList.add('incorrect');
                    errores++;
                }
                currentBoard[r][c] = num; 
            }
        }
    }

    if (errores === 0) {
        if (esSudokuCompleto(currentBoard)) {
            mensajeP.textContent = '¡Felicidades! ¡Sudoku resuelto correctamente!';
        } else {
            mensajeP.textContent = '¡Bien hecho! Hasta ahora no hay errores. Sigue así.';
        }
    } else {
        mensajeP.textContent = `Tienes ${errores} error(es). ¡Sigue intentándolo!`;
    }
}

function getCurrentBoardFromUI() {
    let board = Array(N).fill(null).map(() => Array(N).fill(0));
    const cells = document.querySelectorAll('#sudoku-grid .cell');
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        const input = cell.querySelector('input');
        const value = input.value.trim();
        board[r][c] = value !== '' ? parseInt(value) : 0;
    });
    return board;
}

function esSudokuCompleto(board) {
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            if (board[r][c] === 0) {
                return false;
            }
        }
    }
    return true;
}


function resolverSudoku() {
    const mensajeP = document.getElementById('mensaje');
    let solverBoard = getCurrentBoardFromUI(); 

    let fixedCells = Array(N).fill(null).map(() => Array(N).fill(false));
    for(let r = 0; r < N; r++) {
        for(let c = 0; c < N; c++) {
            if (tableroInicial[r][c] !== 0) {
                fixedCells[r][c] = true;
            }
        }
    }

    if (solve(solverBoard, fixedCells)) {
        tableroActual = solverBoard.map(row => [...row]); 
        renderizarSudoku(tableroActual); 
        mensajeP.textContent = '¡Sudoku resuelto!';
    } else {
        mensajeP.textContent = 'Este Sudoku no tiene solución.';
    }
}

function solve(grid, fixedCells) {
    let row = -1;
    let col = -1;
    let isEmpty = true;

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            if (grid[r][c] === 0 && !fixedCells[r][c]) {
                row = r;
                col = c;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) break;
    }

    if (isEmpty) return true; 

    for (let num = 1; num <= N; num++) {
        if (esSeguro(grid, row, col, num)) {
            grid[row][col] = num;
            if (solve(grid, fixedCells)) {
                return true;
            } else {
                grid[row][col] = 0; 
            }
        }
    }
    return false; 
}

function esSeguro(grid, row, col, num) {
    for (let x = 0; x < N; x++) {
        if (grid[row][x] === num && x !== col) { 
            return false;
        }
    }

    for (let x = 0; x < N; x++) {
        if (grid[x][col] === num && x !== row) { 
            return false;
        }
    }

    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num && (i + startRow !== row || j + startCol !== col)) {
                 return false;
            }
        }
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarGrid();
    generarSudoku(); 
});