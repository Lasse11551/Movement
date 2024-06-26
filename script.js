"use strict";

window.addEventListener("load", start);

/* model */

const player = {
  x: 23,
  y: 23,
  regX: 13,
  regY: 33,
  hitbox: {
    x: 9,
    y: 23,
    w: 13,
    h: 12
  },
  speed: 100,
  move: false,
  direction: undefined,
};

const controls = {
  left: false,
  right: false,
  up: false,
  down: false,
};

const items = [
  { type: 'gold', row: 1, col: 2, pickedUp: false },
  { type: 'gold', row: 5, col: 2, pickedUp: false },
  { type: 'gold', row: 6, col: 5, pickedUp: false },
];

const enemies = [
{ type: 'blop', row: 7, col: 8 },
{ type: 'blop', row: 3, col: 13 },
{ type: 'blop', row: 7, col: 5 }
];

const tiles = [
  [0,3,3,3,3,3,0,0,0,0,0,0,0,0,0],
  [0,3,5,5,5,3,0,0,0,0,0,0,0,0,0],
  [0,3,5,5,5,3,0,0,0,0,0,0,0,0,0],
  [0,3,3,5,3,3,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,0,0,2,2,2,0,0],
  [0,0,0,0,0,0,1,1,0,0,2,2,2,0,0],
  [0,0,0,0,0,0,1,1,0,0,2,2,2,0,0],
  [2,2,2,2,2,2,4,4,2,2,2,2,2,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
]

const GRID_WIDTH = tiles[0].length;
const GRID_HEIGHT = tiles.length;
const TILE_SIZE = 32;

function getTileAtCoord({row, col}) {
  //Man kan sætte et objekt op i parameteren, som spørger efter et objekt som indeholder row og col
  //Ved at gøre dette behøver man ikke definere nogle variabler
  return tiles[row][col]
}

function coordFromPos({x, y}){
  const row = Math.floor(y / TILE_SIZE);
  const col = Math.floor(x / TILE_SIZE);
  const coord = {row, col};
  return coord;
}

function posFromCoord({row, col}) {

}

function getTilesUnderPlayer(player, newPos={x: player.x, y: player.y}) {
  const tileCoords = [];

  const topLeft = {x: newPos.x - player.regX + player.hitbox.x, 
                   y: newPos.y - player.regY + player.hitbox.y}

  const topRight = {x: newPos.x - player.regX + player.hitbox.x + player.hitbox.w, 
                    y: newPos.y - player.regY + player.hitbox.y}

  const bottomLeft = {x: newPos.x - player.regX + player.hitbox.x, 
                      y: newPos.y - player.regY + player.hitbox.y + player.hitbox.h};

  const bottomRight = {x: newPos.x - player.regX + player.hitbox.x + player.hitbox.w, 
                       y: newPos.y - player.regY + player.hitbox.y + player.hitbox.h};

  const topLeftCoords = coordFromPos(topLeft);
  const topRightCoords = coordFromPos(topRight);
  const bottomLeftCoords = coordFromPos(bottomLeft);
  const bottomRightCoords = coordFromPos(bottomRight);
  tileCoords.push(topLeftCoords)
  tileCoords.push(topRightCoords)
  tileCoords.push(bottomLeftCoords)
  tileCoords.push(bottomRightCoords)
  return tileCoords;
}

function canMovePlayerToPos(player, pos) {
  const coords = getTilesUnderPlayer(player, pos);
  return coords.every(canMoveTo)
}

function keyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      controls.left = true;
      break;
    case "ArrowRight":
      controls.right = true;
      break;
    case "ArrowUp":
      controls.up = true;
      break;
    case "ArrowDown":
      controls.down = true;
      break;
  }
  /* console.log(controls); */
}

function keyUp(event) {
  switch (event.key) {
    case "ArrowLeft":
      controls.left = false;
      break;
    case "ArrowRight":
      controls.right = false;
      break;
    case "ArrowUp":
      controls.up = false;
      break;
    case "ArrowDown":
      controls.down = false;
      break;
  }
  /* console.log(controls); */
}

function canMoveTo({row, col}) {

  if(row < 0 || row >= GRID_HEIGHT ||
     col < 0 || col >= GRID_WIDTH) {
      return false;
  }

  const tileType = getTileAtCoord({row, col});
  switch(tileType) {
    case 0:
    case 1:
    case 4:
    case 5: return true;
            break;
    case 2:
    case 3: return false;
            break;
  }
  return true;
}

function movePlayer(deltaTime) {
  player.moving = false;

  const newPos = {
    x: player.x,
    y: player.y,
  };

  if (controls.left) {
    player.moving = true;
    player.direction = "left";
    newPos.x -= player.speed * deltaTime;
  } else if (controls.right) {
    player.moving = true;
    player.direction = "right";
    newPos.x += player.speed * deltaTime;
  }

  if (controls.up) {
    player.moving = true;
    player.direction = "up";
    newPos.y -= player.speed * deltaTime;
  } else if (controls.down) {
    player.moving = true;
    player.direction = "down";
    newPos.y += player.speed * deltaTime;
  }
  if (canMovePlayerToPos(player, newPos)) {
    player.x = newPos.x;
    player.y = newPos.y;
  } else {
    
  }
}

function pickupItems(player) {
  // Convert player's current position to grid coordinates
  const playerPos = coordFromPos({x: player.x, y: player.y});

  items.forEach(item => {
    if (playerPos.row === item.row && playerPos.col === item.col && !item.pickedUp) {
      console.log("Virker")
      item.pickedUp = true;  // Mark the item as picked up
      displayItems();
    }
  });
}

/* view */

function displayEnemies() {
  const itemsContainer = document.querySelector('#characters');
  itemsContainer.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  itemsContainer.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
  itemsContainer.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");

  enemies.forEach(enemy => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('enemy', enemy.type);  // Use item.type as a class for CSS styling
      itemDiv.style.gridRowStart = enemy.row + 1;
      itemDiv.style.gridColumnStart = enemy.col + 1;
      itemsContainer.appendChild(itemDiv);
  });
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'e' || event.key === 'E') {  // Check if 'e' or 'E' was pressed
    pickupItems(player);  // Call your pickup function
  }
});

function displayItems() {
  const itemsContainer = document.querySelector('#items');
  itemsContainer.innerHTML = "";
  itemsContainer.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  itemsContainer.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
  itemsContainer.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");

  items.forEach(item => {
    if(!item.pickedUp) {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item', item.type);  // Use item.type as a class for CSS styling
      itemDiv.style.gridRowStart = item.row + 1;
      itemDiv.style.gridColumnStart = item.col + 1;
      itemsContainer.appendChild(itemDiv);
    }
  });
}

function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.style.translate = `${player.x - player.regX}px ${player.y - player.regY}px`;
}
function displayPlayerAnimation() {
  const visualPlayer = document.querySelector("#player");

  if (player.direction && !visualPlayer.classList.contains(player.direction)) {
    visualPlayer.classList.remove("up", "down", "left", "right");
    visualPlayer.classList.add(player.direction);
  }if (!player.moving) {
    visualPlayer.classList.remove("animate");
  } else if(!visualPlayer.classList.contains("animate")){
    visualPlayer.classList.add("animate")
  }
}

function createTiles() {
  const background = document.querySelector("#background")
  //scan igennem alle row og cols

  //For hver af dem lave en div.item og tilføj til baggrunden
  for(let row = 0; row < GRID_HEIGHT; row++){
    for(let col = 0; col < GRID_WIDTH; col++) {
      const tile = document.createElement("div")
      tile.classList.add("tile")
      background.append(tile)
    }
  }
  background.style.setProperty("--GRID_WIDTH", GRID_WIDTH)
  background.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT)
  background.style.setProperty("--TILE_SIZE", TILE_SIZE+"px")
}

function displayTiles() {
  const visualTiles = document.querySelectorAll("#background .tile")

  for(let row = 0; row < GRID_HEIGHT; row++){
    for(let col = 0; col < GRID_WIDTH; col++) {

      const modelTile = getTileAtCoord({row, col});
      const visualTile = visualTiles[row*GRID_WIDTH+col]

      visualTile.classList.add( getClassForTileType( modelTile));
    }
  }
}

function getClassForTileType( tileType ) {
  switch(tileType) {
    case 0: return "grass"; break;
    case 1: return "path"; break;
    case 2: return "water"; break;
    case 3: return "wall"; break;
    case 4: return "floor"; break;
    case 5: return "rug"; break;
  }
}

/* Controller */
let lastTimestamp = 0;

function tick(timestamp) {
  requestAnimationFrame(tick);

  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  movePlayer(deltaTime);

  displayPlayerAtPosition();
  displayPlayerAnimation();
  showDebuging()
}

function start() {
  console.log("javascript is running");
  createTiles();
  displayTiles();
  displayItems();
  displayEnemies();

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  requestAnimationFrame(tick);
}

//DEBUGING

let hightlightedTiles = [];

function showDebuging() {
  showDebugTileUnderPlayer();
  showDebugPlayerRect();
  showDebugPlayerRegistrationPoint();
  showDebugPlayerHitbox();
}

let lastPlayerCoord = {row: 0, col: 0};

function showDebugTileUnderPlayer() {
  hightlightedTiles.forEach(unhightlightTile);

  const tileCoords = getTilesUnderPlayer(player);
  tileCoords.forEach(hightlightTile)

  hightlightedTiles = tileCoords;
}

function showDebugPlayerRegistrationPoint() {
  const visualPlayer = document.querySelector("#player")
  if(!visualPlayer.classList.contains("show-reg-point")) {
    visualPlayer.classList.add("show-reg-point")
  }

  visualPlayer.style.setProperty("--regX", player.regX +"px")
  visualPlayer.style.setProperty("--regY", player.regY +"px")
}

function showDebugPlayerRect() {
  const visualPlayer = document.querySelector("#player")
  if(!visualPlayer.classList.contains("show-rect")) {
    visualPlayer.classList.add("show-rect")
  }
}

function showDebugPlayerHitbox() {
  const visualPlayer = document.querySelector("#player")
  visualPlayer.style.setProperty("--hitboxX", player.hitbox.x +"px");
  visualPlayer.style.setProperty("--hitboxY", player.hitbox.y +"px");
  visualPlayer.style.setProperty("--hitboxW", player.hitbox.w +"px");
  visualPlayer.style.setProperty("--hitboxH", player.hitbox.h +"px");
  if(!visualPlayer.classList.contains("show-hitbox")) {
    visualPlayer.classList.add("show-hitbox")
  }
}

function hightlightTile({row, col}) {
  const visualTiles = document.querySelectorAll("#background .tile")
  const visualTile = visualTiles[row*GRID_WIDTH+col]

  visualTile.classList.add("hightlight")

}

function unhightlightTile({row, col}) {
  const visualTiles = document.querySelectorAll("#background .tile")
  const visualTile = visualTiles[row*GRID_WIDTH+col]

  visualTile.classList.remove("hightlight")
}
