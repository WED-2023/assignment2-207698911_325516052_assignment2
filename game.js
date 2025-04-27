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
let enemyYChange = 10;
let enemyYchangeTime = 0;
let firstLoop = false;
let backgroundMusic;
let failSound;
let explosionAudio;
let canvasbackground;
// === Constants ===
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const PLAY_AREA_HEIGHT = CANVAS_HEIGHT * 0.4;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ENEMY_BULLET_SPEED = 4;
const MAX_SPEEDUPS = 4;
const PLAYER_COOLDOWN = 50;
const ENEMY_SPEEDUP = 0.15;
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
        playerBullets.push(new Bullet(this.x + this.width/2, this.y, -BULLET_SPEED,0, "player"));
        this.cooldown = PLAYER_COOLDOWN; 
      }
    }
  
    draw(ctx) {
      this.draw_ship(ctx,shipColor)
      // Overlay a white semi-transparent rectangle
      if(this.cooldown != 0){

        this.draw_ship(ctx,"rgba(255, 255, 255, 0.36)")
      }
      if(this.cooldown > 20){
        this.draw_ship(ctx,"rgba(255, 255, 255, 0.36)")
      }
    }
    draw_ship(ctx,color){
      ctx.save(); // Save canvas state

      ctx.fillStyle = color;
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
    
      ctx.beginPath();
    
      // Nose of the ship (top middle)
      ctx.moveTo(this.x + this.width / 2, this.y);
    
      // Left wing
      ctx.lineTo(this.x, this.y + this.height * 0.7);
    
      // Center bottom
      ctx.lineTo(this.x + this.width / 2, this.y + this.height);
    
      // Right wing
      ctx.lineTo(this.x + this.width, this.y + this.height * 0.7);
    
      // Back to nose
      ctx.closePath();
    
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "lightblue";
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y  , this.width * 0.1, 0, Math.PI * 2);
      ctx.fill();
    
      ctx.restore(); // Restore canvas state
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
      this.bobing_factor = Math.random()*10; //how much it moves up and down
      this.bobing_completion = 0;
      this.bobing_direction = 1;
    }
    bob(){
      this.y+=(this.bobing_direction*this.bobing_factor)/10;
      this.bobing_completion+=1;
      if(this.bobing_completion==10) 
      {
        this.bobing_direction = -this.bobing_direction;
        this.bobing_completion = 0;
      }
    }
    draw(ctx) {
      ctx.save();

      // Base color
      ctx.fillStyle = ["red", "orange", "yellow", "purple"][this.row];
      this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8); // radius 8
      ctx.fill();
    
      // Gloss effect
      ctx.fillStyle = "black"; // white with 20% opacity
      this.drawRoundedRect(ctx, this.x+5, this.y+5, this.width-10, (this.height / 2)-5, 8); // only top half
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x + this.width / 3, this.y  , this.width * 0.1, 0, Math.PI * 2);
      ctx.fill();

      
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x + (this.width / 3)*2, this.y  , this.width * 0.1, 0, Math.PI * 2);
      ctx.fill();
    
      ctx.restore();
    }
    drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }
  
  class Bullet {
    constructor(x, y, speedY,speedX, owner) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 10;
      this.speedY = speedY;
      this.speedX = speedX*(Math.random() * 2 - 1);
      this.owner = owner; // "player" or "enemy"
      if(owner=="enemy")
      {
        if(Math.random()>0.8)
          this.speedX = 0.8*BULLET_SPEED*(this.x-player.x)/(this.y-player.y);
      }
      this.active = true;
    }
  
    update() {
      this.y += this.speedY;
      if (this.y < 0 || this.y > CANVAS_HEIGHT) {
        this.active = false;
      }
      this.x += this.speedX;
      if (this.x < 0 || this.x > CANVAS_WIDTH) {
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
    shootKey = localStorage.getItem('shootKey') || " ";
    gameTime = localStorage.getItem('gameTime')*60 || 120;
    shipColor = localStorage.getItem('shipColor') || "white";
    canvas = document.getElementById("mycanvas");
    ctx = canvas.getContext("2d");
    backgroundMusic = document.getElementById('backgroundMusic');
    failSound = document.getElementById('failSound');
    explosionAudio = document.getElementById('hitSound');
    canvasbackground = new Image();
    canvasbackground.src = "images/canvasBackground.jpg"
    
    firstLoop = true;
    // Display the retrieved values (for testing) 
    document.getElementById('output').innerText = 
        `Shooting key: ${shootKey}\nGame time: ${gameTime}\nShip color: ${shipColor}`;
    player = new Player();
    createEnemies();
    gameRunning = true;

}



// === Drawing ===
function draw(time) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(canvasbackground, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
    ctx.fillText(`Time: ${formatTime(gameTime-time+curtime)}`, 10, 80);
    
    
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Pad with leading zeros if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }



function update(deltaTime) {


    player.update();
    let moveDown = false;
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      enemy.bob()
      enemy.x += enemySpeed * enemyDirection;
      if (enemy.x <= 0 || enemy.x + enemy.width >= CANVAS_WIDTH) {
        moveDown = true;
      }
    }
    if (moveDown) {
      enemyDirection *= -1;
      for (const enemy of enemies) {
        if (enemy.alive) enemy.y += enemyYChange;
      }
      enemyYchangeTime = enemyYchangeTime + 1;
      if (enemyYchangeTime ==5)
      {
        enemyYChange = -enemyYChange;
        enemyYchangeTime=0;
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
      enemySpeed += ENEMY_SPEEDUP;
      speedIncreaseTimer = 0;
      speedUpCount++;
    }
  }

  function handleEnemyShooting() {
    if (areAllEnemyBulletsBelow75()) {
      let shooters = enemies.filter(e => e.alive);
      if (shooters.length > 0) {
        let shooter = shooters[Math.floor(Math.random() * shooters.length)];
        enemyBullets.push(new Bullet(shooter.x + shooter.width/2, shooter.y + shooter.height, ENEMY_BULLET_SPEED,enemySpeed, "enemy"));
      }
    }
  }

  function areAllEnemyBulletsBelow75() {
    const activeEnemyBullets = enemyBullets.filter(b => b.owner === "enemy" && b.active);
  
    for (const bullet of activeEnemyBullets) {
      if (bullet.y < CANVAS_HEIGHT * 0.75) {
        return false; // At least one bullet not far enough
      }
    }
  
    return true; // All bullets are far enough
  }
let curtime=0;

function gameLoop(timestamp) {
    if(firstLoop)//
    {//timer
      backgroundMusic.play();
      curtime = timestamp/1000; //this is because i had trouble with thetimer
      firstLoop = false;//
    }//timer
    if (!gameRunning){
      backgroundMusic.pause();
      return;
    }
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp/1000;
    update(deltaTime);
    handleEnemyShooting();
    checkCollisions();
    handleInput();
    gameElapsedTime += deltaTime;
    draw(timestamp/1000); 
    requestAnimationFrame(gameLoop);
    checkEnding(timestamp/1000);
}

let keysPressed = {};
window.addEventListener("keydown", (e) => {
    if (!gameRunning) return;
    e.preventDefault();
    keysPressed[e.key] = true;
   // if (e.key === " ") player.shoot(); // shooting still happens once
  });
  
window.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
  });

function handleInput() {
    if (keysPressed["ArrowLeft"]) player.move(-1, 0);
    if (keysPressed["ArrowRight"]) player.move(1, 0);
    if (keysPressed["ArrowUp"]) player.move(0, -1);
    if (keysPressed["ArrowDown"]) player.move(0, 1);
    if (keysPressed[shootKey === "Space" ? " " : shootKey.toLowerCase()]) player.shoot();
    if (keysPressed[shootKey.toUpperCase()]) player.shoot();
  }

// === Collision Detection ===
async function checkCollisions() {
    for (const bullet of playerBullets) {
      for (const enemy of enemies) {
        if (enemy.alive && isColliding(bullet, enemy)) {
          bullet.active = false;
          enemy.alive = false;
          playExplosionSound()
          score += (enemy.row === 3 ? 5 : enemy.row === 2 ? 10 : enemy.row === 1 ? 15 : 20);
        }
      }
    }
  
    for (const bullet of enemyBullets) {
      if (isColliding(bullet, player)) {
        bullet.active = false;
        lives--;
        failSound.play();
        player = new Player();
      }
    }
  }
  
  function isColliding(a, b) {
    if (a instanceof Player) {
      // Get triangle points of the player
      const noseX = a.x + a.width / 2;
      const noseY = a.y;
      const leftWingX = a.x;
      const leftWingY = a.y + a.height * 0.7;
      const rightWingX = a.x + a.width;
      const rightWingY = a.y + a.height * 0.7;
  
      // Check if any bullet corner is inside the triangle
      const corners = [
        {x: b.x, y: b.y},
        {x: b.x + b.width, y: b.y},
        {x: b.x, y: b.y + b.height},
        {x: b.x + b.width, y: b.y + b.height}
      ];
  
      for (const corner of corners) {
        if (pointInTriangle(corner.x, corner.y, noseX, noseY, leftWingX, leftWingY, rightWingX, rightWingY)) {
          return true;
        }
      }
      return false;
    }
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  function playExplosionSound() {
    const clone = explosionAudio.cloneNode(true); // explosionAudio is your preloaded audio
    clone.play();
}
initGame();
requestAnimationFrame(gameLoop);

function checkEnding(time){
  if (gameTime-time<0)
    endingTimeRunOut();
  if (lives<1)
    endingLivesOut();
  if (score==250)
    endingChampion();
}






















// Ending when time runs out
function endingTimeRunOut() {
  let resultMessage = '';
  if (score < 100) {
      resultMessage = `You can do better! Your score: ${score}`;
  } else {
      resultMessage = `Winner! Your score: ${score}`;
  }
  displayEndGameMessage('timeOutMessage', resultMessage);
}

// Ending when lives run out
function endingLivesOut() {
  displayEndGameMessage('lostMessage', 'You Lost!');
}

// Ending when all enemies are destroyed
function endingChampion() {
  displayEndGameMessage('championMessage', 'Champion!');
}

// Function to display the correct end game message
function displayEndGameMessage(divId, message) {
  gameRunning = false;
  // Hide all ending messages
  const endMessages = document.querySelectorAll('.endMessage');
  endMessages.forEach(msg => msg.style.display = 'none');

  // Show the correct message
  const resultElement = document.getElementById(divId);
  resultElement.style.display = 'block';

  // If it's the timeout message, also update the message with the score
  if (divId === 'timeOutMessage') {
      document.getElementById('timeOutText').innerText = message;
  }

  // Add score to history
  scoreHistory.push(score);
  updateScoreHistory();
}
function updateScoreHistory() {
  const scoreHistoryList = document.getElementById('scoreHistoryList');
  scoreHistoryList.innerHTML = ''; // Clear current list

  scoreHistory.forEach((score, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Game ${index + 1}: ${score} points`;
      scoreHistoryList.appendChild(listItem);
  });
}
function startNewGame() {
  // Reset variables for a new game
  lives = 3;
  score = 0;
  gameTime = 120;  // Or whatever time value you'd like to start with
  enemySpeed = 0.1;
  speedIncreaseTimer = 0;
  firstLoop = true;
  speedUpCount = 0;
  gameElapsedTime = 0;
  enemyDirection = 1;
  enemies = [];  // Reset the enemies array
  playerBullets = [];  // Reset player bullets
  enemyBullets = [];  // Reset enemy bullets
  createEnemies();  // Re-create the enemies
  player = new Player();  // Reinitialize the player
  
  gameRunning = true;

  // Optionally: reset the UI or any other game state like score/history display
  document.getElementById('output').innerText = 
    `Shooting key: ${shootKey}\nGame time: ${gameTime}\nShip color: ${shipColor}`;

  // Start the game loop
  requestAnimationFrame(gameLoop);
}
