const GRID_SIZE = 10;
const container = document.getElementById('game-container');
const scoreElement = document.getElementById('score');

let score = 0;
let playerPos = { x: 1, y: 1 };

// Legend: W = Wall, P = Player, D = Diamond, B = Boulder, . = Empty
let world = [
    ['W','W','W','W','W','W','W','W','W','W'],
    ['W','P','.','.','.','W','D','.','.','W'],
    ['W','.','B','.','.','W','.','B','.','W'],
    ['W','.','.','.','.','.','.','.','.','W'],
    ['W','W','W','.','.','W','W','W','.','W'],
    ['W','D','.','B','.','.','.','D','.','W'],
    ['W','.','.','.','.','W','.','.','.','W'],
    ['W','.','B','.','D','W','.','B','.','W'],
    ['W','D','.','.','.','.','.','.','D','W'],
    ['W','W','W','W','W','W','W','W','W','W'],
];

function draw() {
    container.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            
            const cell = world[y][x];
            if (cell === 'W') { tile.innerText = '🧱'; tile.classList.add('wall'); }
            else if (cell === 'P') tile.innerText = '🤠';
            else if (cell === 'D') tile.innerText = '💎';
            else if (cell === 'B') tile.innerText = '🌑'; // Boulder
            
            container.appendChild(tile);
        }
    }
}

function move(dx, dy) {
    let newX = playerPos.x + dx;
    let newY = playerPos.y + dy;
    let target = world[newY][newX];

    if (target !== 'W' && target !== 'B') {
        if (target === 'D') {
            score++;
            scoreElement.innerText = score;
        }
        
        // Update world
        world[playerPos.y][playerPos.x] = '.';
        playerPos = { x: newX, y: newY };
        world[newY][newX] = 'P';
        
        updatePhysics();
        draw();
    }
}

function updatePhysics() {
    // Basic Gravity: Boulders fall down if empty space below
    for (let y = GRID_SIZE - 2; y >= 0; y--) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (world[y][x] === 'B' && world[y+1][x] === '.') {
                world[y][x] = '.';
                world[y+1][x] = 'B';
            }
        }
    }
}

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move(0, -1);
    if (e.key === 'ArrowDown') move(0, 1);
    if (e.key === 'ArrowLeft') move(-1, 0);
    if (e.key === 'ArrowRight') move(1, 0);
});

draw();
