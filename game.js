// === Globals ===
let canvas, ctx;
let player;
let enemies = [];
let playerBullets = [];
let enemyBullets = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let lastEnemyShotTime = 0;
let enemySpeed = 0.1;
let speedIncreaseTimer = 0;
let speedUpCount = 0;
let lastTime = 0;
let enemyDirection = 1;
let gameElapsedTime = 0;
let shootKey;
let gameTime;

// === Constants ===
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const PLAY_AREA_HEIGHT = CANVAS_HEIGHT * 0.4;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ENEMY_BULLET_SPEED = 4;
const MAX_SPEEDUPS = 4;
const PLAYER_COOLDOWN = 50;

class Player {
    constructor() {
      this.width = 40;
      this.height = 40;
      this.x = Math.random() * (CANVAS_WIDTH - this.width);
      this.y = CANVAS_HEIGHT - this.height - 10;
      this.cooldown = 0;
    }
  
    move(dx, dy) {
      let newX = this.x + dx * PLAYER_SPEED;
      let newY = this.y + dy * PLAYER_SPEED;
  
      if (newX >= 0 && newX + this.width <= CANVAS_WIDTH) {
        this.x = newX;
      }
      if (newY >= CANVAS_HEIGHT - PLAY_AREA_HEIGHT && newY + this.height <= CANVAS_HEIGHT) {
        this.y = newY;
      }
    }
  
    shoot() {
      if(this.cooldown == 0){
        playerBullets.push(new Bullet(this.x + this.width/2, this.y, -BULLET_SPEED, "player"));
        this.cooldown = PLAYER_COOLDOWN; 
      }
    }
  
    draw(ctx) {
      ctx.fillStyle = shipColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
      if(this.cooldown>0)
        this.cooldown = this.cooldown-1;
    }

}
class Enemy {
    constructor(x, y, row) {
      this.width = 40;
      this.height = 30;
      this.x = x;
      this.y = y;
      this.row = row;
      this.alive = true;
    }
  
    draw(ctx) {
      ctx.fillStyle = ["red", "orange", "yellow", "purple"][this.row];
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  class Bullet {
    constructor(x, y, speedY, owner) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 10;
      this.speedY = speedY;
      this.owner = owner; // "player" or "enemy"
      this.active = true;
    }
  
    update() {
      this.y += this.speedY;
      if (this.y < 0 || this.y > CANVAS_HEIGHT) {
        this.active = false;
      }
    }
  
    draw(ctx) {
      ctx.fillStyle = this.owner === "player" ? "cyan" : "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }


}

function createEnemies() {
    const offsetX = 100;
    const offsetY = 50;
    const spacingX = 80;
    const spacingY = 60;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        enemies.push(new Enemy(offsetX + col * spacingX, offsetY + row * spacingY, row));
      }
    }
}

function initGame() {
    // Retrieve configuration values stored in localStorage from index.html
    shootKey = localStorage.getItem('shootKey');
    gameTime = localStorage.getItem('gameTime');
    shipColor = localStorage.getItem('shipColor') || "white";
    canvas = document.getElementById("mycanvas");
    ctx = canvas.getContext("2d");

    
    // Display the retrieved values (for testing) 
    document.getElementById('output').innerText = 
        `Shooting key: ${shootKey}\nGame time: ${gameTime}\nShip color: ${shipColor}`;
    player = new Player();
    createEnemies();
    gameRunning = true;

}


// === Drawing ===
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    player.draw(ctx);
    for (const enemy of enemies) {
      if (enemy.alive) enemy.draw(ctx);
    }
    for (const bullet of playerBullets.concat(enemyBullets)) {
      bullet.draw(ctx);
    }
  
    // Draw UI
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Lives: ${lives}`, 10, 50);
  }
  



function update(deltaTime) {
    // Move enemies
    player.update();
    let moveDown = false;
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      enemy.x += enemySpeed * enemyDirection;
      if (enemy.x <= 0 || enemy.x + enemy.width >= CANVAS_WIDTH) {
        moveDown = true;
      }
    }
    if (moveDown) {
      enemyDirection *= -1;
      for (const enemy of enemies) {
        if (enemy.alive) enemy.y += 20;
      }
    }
  
        // Update bullets
    for (const bullet of playerBullets.concat(enemyBullets)) {
      bullet.update();
    }
    playerBullets = playerBullets.filter(b => b.active);
    enemyBullets = enemyBullets.filter(b => b.active);
  
    // Speed up
    speedIncreaseTimer += deltaTime;
    if (speedIncreaseTimer >= 5 && speedUpCount < MAX_SPEEDUPS) {
      enemySpeed += 0.5;
      speedIncreaseTimer = 0;
      speedUpCount++;
    }
  }

  function handleEnemyShooting(timestamp) {
    if (timestamp - lastEnemyShotTime > 1000) { // 1 sec
      let shooters = enemies.filter(e => e.alive);
      if (shooters.length > 0) {
        let shooter = shooters[Math.floor(Math.random() * shooters.length)];
        enemyBullets.push(new Bullet(shooter.x + shooter.width/2, shooter.y + shooter.height, ENEMY_BULLET_SPEED, "enemy"));
        lastEnemyShotTime = timestamp;
      }
    }
  }
  

function gameLoop(timestamp) {
    if (!gameRunning) return;
  
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
  
    update(deltaTime);
    handleEnemyShooting(timestamp);
    checkCollisions();
    handleInput();
    gameElapsedTime += deltaTime;
    
    draw(); // inside draw() you can show aaa/bbb if you want
  
    requestAnimationFrame(gameLoop);
}

let keysPressed = {};
window.addEventListener("keydown", (e) => {
    if (!gameRunning) return;
    keysPressed[e.key] = true;
    if (e.key === " ") player.shoot(); // shooting still happens once
  });
  
window.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
  });

function handleInput() {
    if (keysPressed["ArrowLeft"]) player.move(-1, 0);
    if (keysPressed["ArrowRight"]) player.move(1, 0);
    if (keysPressed["ArrowUp"]) player.move(0, -1);
    if (keysPressed["ArrowDown"]) player.move(0, 1);
  }

// === Collision Detection ===
function checkCollisions() {
    for (const bullet of playerBullets) {
      for (const enemy of enemies) {
        if (enemy.alive && isColliding(bullet, enemy)) {
          bullet.active = false;
          enemy.alive = false;
          score += (enemy.row === 3 ? 5 : enemy.row === 2 ? 10 : enemy.row === 1 ? 15 : 20);
        }
      }
    }
  
    for (const bullet of enemyBullets) {
      if (isColliding(bullet, player)) {
        bullet.active = false;
        lives--;
        if (lives <= 0) {
          gameRunning = false;
          alert("Game Over!");
        } else {
          player = new Player(); // Reset player position
        }
      }
    }
  }
  
  function isColliding(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

initGame();
requestAnimationFrame(gameLoop);