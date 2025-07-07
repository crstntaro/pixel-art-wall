const grid = document.getElementById('grid');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const board = document.getElementById('board');

const rows = 16;
const cols = 16;
let isDrawing = false;

// Create canvas
function createGrid() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('mousedown', () => {
      isDrawing = true;
      cell.style.backgroundColor = colorPicker.value;
    });
    cell.addEventListener('mouseover', () => {
      if (isDrawing) {
        cell.style.backgroundColor = colorPicker.value;
      }
    });
    cell.addEventListener('mouseup', () => isDrawing = false);
    grid.appendChild(cell);
  }
}

document.body.addEventListener('mouseup', () => isDrawing = false);

// Only clear canvas
clearBtn.addEventListener('click', () => {
  document.querySelectorAll('#grid .cell').forEach(cell => {
    cell.style.backgroundColor = 'white';
  });
});

// Save art to wall
saveBtn.addEventListener('click', () => {
  const colors = Array.from(document.querySelectorAll('#grid .cell'))
    .map(cell => cell.style.backgroundColor || 'white');

  let saved = JSON.parse(localStorage.getItem('pixelWall') || '[]');
  saved.push(colors);
  localStorage.setItem('pixelWall', JSON.stringify(saved));

  renderBoard(); // Immediately show it
  clearBtn.click();
});

// Render saved art
function renderBoard() {
  board.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem('pixelWall') || '[]');

  saved.forEach((colors, index) => {
    const note = document.createElement('div');
    note.classList.add('board-item');
    note.style.setProperty('--rotate', `${Math.random() * 6 - 3}deg`);

    const pixelBox = document.createElement('div');
    pixelBox.classList.add('board-pixels');

    colors.forEach(color => {
      const px = document.createElement('div');
      px.classList.add('cell');
      px.style.backgroundColor = color;
      pixelBox.appendChild(px);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = "×";
    delBtn.classList.add('delete-btn');
    delBtn.onclick = () => deleteNote(index);

    note.appendChild(delBtn);
    note.appendChild(pixelBox);
    board.appendChild(note);
  });
}

// Delete a note
function deleteNote(index) {
  const saved = JSON.parse(localStorage.getItem('pixelWall') || '[]');
  saved.splice(index, 1);
  localStorage.setItem('pixelWall', JSON.stringify(saved));
  renderBoard();
}

createGrid();
renderBoard();