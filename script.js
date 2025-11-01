const ROWS = 15;
const COLS = 30;
const startPos = {row: 7, col: 5};
const finishPos = {row: 7, col: 25};
let grid = [];
let mouseDown = false;

// Create and draw grid
function createGrid() {
  const gridDiv = document.getElementById('grid');
  gridDiv.innerHTML = '';
  grid = [];

  // First, create all cells and put them on the page
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (r === startPos.row && c === startPos.col) cell.classList.add('start');
      if (r === finishPos.row && c === finishPos.col) cell.classList.add('finish');
      gridDiv.appendChild(cell); // visual representation
      row.push(cell); // in data form
    }
    grid.push(row);
    gridDiv.appendChild(document.createElement('br'));
  }

  // Now, attach event listeners to all cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];

      cell.addEventListener('mousedown', () => {
        if (!cell.classList.contains('start') && !cell.classList.contains('finish')) {
          cell.classList.toggle('wall');
        }
        mouseDown = true;
      });

      cell.addEventListener('mouseenter', () => {
        if (mouseDown && !cell.classList.contains('start') && !cell.classList.contains('finish')) {
          cell.classList.add('wall');  // build wall while dragging
        }
      });

      cell.addEventListener('mouseup', () => { mouseDown = false; });
    }
  }
}

// Make sure mouse release works anywhere on the page
/*If you don’t listen for mouseup on the whole document.body,
the grid’s cells never “see” that the mouse was released.
So mouseDown stays true, and when you move back over the grid,
it keeps adding walls — even though you’re not holding the mouse anymore  */
document.body.addEventListener('mouseup', () => mouseDown = false);

// Dijkstra algorithm
function visualize() {
  let distance = Array.from({length: ROWS}, () => Array(COLS).fill(Infinity)); //built-in JavaScript method that creates a new array & shortest known distance
  let prev = Array.from({length: ROWS}, () => Array(COLS).fill(null)); // The previous node (to trace path back)
  distance[startPos.row][startPos.col] = 0;

  let nodes = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      nodes.push({row: r, col: c});

  while (nodes.length != 0) {
    nodes.sort((a, b) => distance[a.row][a.col] - distance[b.row][b.col]);
    const node = nodes.shift();
    const r = node.row, c = node.col;
    const cell = grid[r][c];
    
    if (cell.classList.contains('wall')) continue;
    if (distance[r][c] === Infinity) break;
    
    cell.classList.add('visited');
    
    if(r === finishPos.row && c === finishPos.col) break;
    
    const directions = [[-1,0],[1,0],[0,-1],[0,1]];
    for (const [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (!grid[nr][nc].classList.contains('wall') && !grid[nr][nc].classList.contains('visited') && distance[nr][nc] > distance[r][c] + 1) {
          distance[nr][nc] = distance[r][c] + 1;
          prev[nr][nc] = [r, c];
        }
      }
    }
  }

  // Draw shortest path
  let r = finishPos.row, c = finishPos.col;
  while(prev[r][c] != null){
    const [pr, pc] = prev[r][c];
    if (!(pr === startPos.row && pc === startPos.col)) grid[pr][pc].classList.add('path');
    r = pr; c = pc;
  }
}

// Clear walls
function clearWalls() {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      grid[r][c].classList.remove('wall');
}

// Reset grid
function resetGrid() { createGrid(); }

// Initialize
createGrid();
