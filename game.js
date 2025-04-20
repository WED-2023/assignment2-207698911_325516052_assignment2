function initGame() {
    // Retrieve configuration values stored in localStorage from index.html
    const shootKey = localStorage.getItem('shootKey');
    const gameTime = localStorage.getItem('gameTime');
    const shipColor = localStorage.getItem('shipColor');
    
    // Display the retrieved values (for testing) or use them in your game logic
    document.getElementById('output').innerText = 
        `Shooting key: ${shootKey}\nGame time: ${gameTime}\nShip color: ${shipColor}`;
}

initGame();