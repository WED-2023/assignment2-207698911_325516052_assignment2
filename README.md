[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/C1S6S1cK)


1. Footer on Scroll
The footer becomes visible only when the player scrolls down the page, creating a clean and dynamic user experience.

2. Cooldown Mechanism for Player Shots
A cooldown is implemented for the player's shooting ability. The cooldown indicator changes color based on the cooldown stage, providing visual feedback to the player about when they can shoot again.

3. Sound Effects for Enemy Kills
Each time an enemy is killed, a sound is played. Multiple kill sounds can play simultaneously for more immersive gameplay.

4. Background
The game features a GIF background that adds a dynamic and visually appealing element to the game environment.

5. Player Hitbox
The player's hitbox is designed as a triangle rather than the traditional square hitbox.


Bonus Features
1. Enemy Movement
Enemies move diagonally in a bobbing up-and-down motion.

2. Player Movement
The player can move diagonally with the help of multiple listeners for different movement directions.

3. Diagonal Enemy Bullets
All enemy bullets travel diagonally slightly (-1 to 1 in x times the enemy speed). One in five enemy bullets is specifically aimed at the player's current position going a complete diagnal.

4. Non-Diagonal Player Shots
We found the game impossible to beat if the player shots are diagonal. it's a matter of giving the bullet creation function a number instead of 0 to make it also diagonal so we intentionally let it straight.


Design Patterns
The game follows these core design patterns:

Game Loop: The main game loop updates the game state at regular intervals.

Update-Draw Design Pattern: The game logic is updated in each cycle, and rendering happens afterward, ensuring smooth transitions and animations.



