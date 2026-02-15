const LEVELS = [
    ["WWWWWWWWWW","WP..B...DW","W..B..O..W","W........W","W..D..B..W","W..WWWW..W","W........W","W..B..D..W","W........W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.D...D.W","W.BBBBBB.W","W....O...W","W.D....D.W","WWWW..WWWW","W........W","W.B.D..B.W","W........W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.W...D.W","W..W.W.W.W","W.D..W.W.W","WWWW.W.W.W","W.D..W.W.W","W.WWWW.W.W","W.O....W.W","W.D.B....W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.......W","W.BBBBBB.W","W...O....W","W.D.D.D..W","W........W","W.BBBBBB.W","W........W","W.D.D.D..W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.W..D.WW","W..W.WW..W","W.B..B..OW","W.W..W.D.W","W.D..B...W","WW..W.WW.W","W.B......W","W...D..D.W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP..B....W","WWWWWWW..W","W.D...W.OW","W..W..W..W","W..W..W..W","W..W..W.DW","W..W..WWWW","W..D..B..W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP...O...W","W.B.B.B.BW","W.D.D.D.DW","W........W","W.B.B.B.BW","W.D.D.D.DW","W........W","W........W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.D.W.D.W","W.B..W..BW","W..O.W...W","WW.WWW.WWW","W....B...W","W.D..W..DW","W....W...W","W..D.W.D.W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.......W","W.B.D.B..W","W.D.B.D..W","W.B.D.B.OW","W.D.B.D..W","W.B.D.B..W","W.D.B.D..W","W........W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.W.....W","W.DW.WWW.W","W.BW.O.W.W","W..W.W.W.W","W.DW.W.W.W","W.BW.W.W.W","W..W.W.W.W","W.D..W.D.W","WWWWWWWWWW"],
    ["WWWWWWWWWW","WP.B.B.B.W","W.D.D.D.DW","W.WWWWWW.W","W...O....W","W.WWWWWW.W","W.D.D.D.DW","W.B.B.B.BW","W........W","WWWWWWWWWW"]
];

let currentLevelIdx = 0;
let world = [];
let playerPos = {x:0, y:0};
let otterPos = {x:0, y:0};
let score = 0;
let gameOver = false;

function initLevel(idx) {
    gameOver = false;
    const levelData = LEVELS[idx % LEVELS.length];
    world = levelData.map(row => row.split(''));
    document.getElementById('lvl').innerText = idx + 1;
    
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) {
            if(world[y][x] === 'P') playerPos = {x, y};
            if(world[y][x] === 'O') otterPos = {x, y};
        }
    }
    draw();
}

function draw() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    world.forEach((row, y) => {
        row.forEach((cell, x) => {
            const tile = document.createElement('div');
            tile.className = 'tile' + (cell === 'W' ? ' wall' : '');
            if(cell === 'W') tile.innerText = '🧱';
            else if(cell === 'P') tile.innerText = '🤠';
            else if(cell === 'D') tile.innerText = '💎';
            else if(cell === 'B') tile.innerText = '🌑';
            else if(cell === 'O') tile.innerText = '🦦';
            container.appendChild(tile);
        });
    });
}

function move(dx, dy) {
    if(gameOver) return;
    let nx = playerPos.x + dx;
    let ny = playerPos.y + dy;

    if (ny < 0 || ny >= 10 || nx < 0 || nx >= 10) return;
    let target = world[ny][nx];

    if (target === '.' || target === 'D' || target === 'O') {
        if (target === 'O') return die("THE OTTER GOT YOU! 🦦");
        if (target === 'D') {
            score++;
            document.getElementById('score').innerText = score;
        }
        world[playerPos.y][playerPos.x] = '.';
        playerPos = {x: nx, y: ny};
        world[ny][nx] = 'P';
        
        moveOtter();
        updatePhysics();
        checkWin();
        draw();
    }
}

function moveOtter() {
    let dx = playerPos.x > otterPos.x ? 1 : (playerPos.x < otterPos.x ? -1 : 0);
    let dy = playerPos.y > otterPos.y ? 1 : (playerPos.y < otterPos.y ? -1 : 0);

    let nextX = otterPos.x + dx;
    let nextY = otterPos.y + dy;

    // AI chooses horizontal or vertical move
    if (world[otterPos.y][nextX] === '.' || world[otterPos.y][nextX] === 'P') {
        updateOtter(nextX, otterPos.y);
    } else if (world[nextY][otterPos.x] === '.' || world[nextY][otterPos.x] === 'P') {
        updateOtter(otterPos.x, nextY);
    }
}

function updateOtter(nx, ny) {
    if (world[ny][nx] === 'P') die("THE OTTER GOT YOU! 🦦");
    world[otterPos.y][otterPos.x] = '.';
    otterPos = {x: nx, y: ny};
    world[ny][nx] = 'O';
}

function updatePhysics() {
    for (let y = 8; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
            if (world[y][x] === 'B' && world[y+1][x] === '.') {
                world[y][x] = '.';
                world[y+1][x] = 'B';
                if(playerPos.x === x && playerPos.y === y+1) die("CRUSHED BY A BOULDER! 🌑");
            }
        }
    }
}

function die(msg) {
    gameOver = true;
    setTimeout(() => { alert(msg); restartLevel(); }, 100);
}

function checkWin() {
    let diamonds = 0;
    world.forEach(row => row.forEach(c => { if(c==='D') diamonds++; }));
    if(diamonds === 0) {
        setTimeout(() => {
            alert("LEVEL CLEAR!");
            currentLevelIdx++;
            initLevel(currentLevelIdx);
        }, 100);
    }
}

function restartLevel() { initLevel(currentLevelIdx); }

window.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp') move(0,-1);
    if(e.key === 'ArrowDown') move(0,1);
    if(e.key === 'ArrowLeft') move(-1,0);
    if(e.key === 'ArrowRight') move(1,0);
});

initLevel(0);
