[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/C1S6S1cK)

# Starships Game

Starships Game is a dynamic web-based arcade game developed by Guy (207698911) and Dan (325516052) for their assignment. The game combines modern aesthetics, engaging gameplay mechanics, and responsive design to create an immersive experience.

## Table of Contents

- [Project Features](#project-features)
- [Bonus Features](#bonus-features)
- [Design Patterns](#design-patterns)
- [Installation & Usage](#installation--usage)
- [Project Structure](#project-structure)
- [Credits](#credits)
- [License](#license)

## Project Features

1. **Footer on Scroll**  
   The footer becomes visible only when the player scrolls down the page, ensuring a clean and dynamic user experience.

2. **Cooldown Mechanism for Player Shots**  
   A robust cooldown is implemented for the player's shooting ability. The cooldown indicator changes color based on its stage, offering clear visual feedback on when the player can shoot again.

3. **Sound Effects for Enemy Kills**  
   Every enemy kill triggers a sound effect. Multiple kill sounds can play simultaneously, enhancing the overall gameplay immersion.

4. **Dynamic Background**  
   The game features an animated GIF background that brings the game environment to life with a dynamic and visually appealing aesthetic.

5. **Player Hitbox Design**  
   Instead of a traditional square, the player's hitbox is designed as a triangle, providing a unique challenge and gameplay variation.

## Bonus Features

1. **Enemy Movement**  
   Enemies move diagonally in a bobbing, up-and-down motion, adding unpredictability to the gameplay.

2. **Player Movement**  
   The player can move diagonally through the use of multiple event listeners assigned for various movement directions.

3. **Diagonal Enemy Bullets**  
   All enemy bullets travel diagonally by a slight offset (-1 to 1 times enemy speed). In every five enemy shots, one bullet is precisely aimed at the player's current position, introducing additional challenge.

4. **Non-Diagonal Player Shots**  
   To balance gameplay, player shots are intentionally kept straight, making it easier to hit targets compared to fully diagonal shooting. This design decision was made after discovering that diagonal shots made the game nearly unbeatable.

## Design Patterns

- **Game Loop:**  
  The game loop continuously updates the game state at regular intervals, ensuring smooth gameplay transitions.

- **Update-Draw Design Pattern:**  
  The logic update and rendering (drawing) phases are clearly separated. This structure guarantees smooth animations and transitions throughout the game.

## Installation & Usage

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/assignment2-207698911_325516052_assignment2.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd assignment2-207698911_325516052_assignment2
   ```

3. **Open the Project:**  
   Open `index.html` in your favorite web browser to see the welcome, sign up, and log in screens.

4. **Game Play:**  
   After signing in and configuring your game settings, click “Start Game” to be redirected to `game.html` where the main gameplay takes place.

5. **About Modal:**  
   Click the About button on the welcome screen to see detailed information about the project (development details, technologies used, challenges, etc.).

## Project Structure

```
assignment2-207698911_325516052_assignment2/
├── index.html            # Main entry point (Welcome, Log In, Sign Up, Config screens)
├── game.html             # Gameplay interface with canvas, scores, and audio
├── styles.css            # Modern CSS styles with animations
├── game.js               # JavaScript with core game logic and interactivity
├── images/               # Game Logo, background images, etc.
├── sounds/               # Audio assets (background music, explosion, etc.)
└── README.md             # This file
```

## Credits

- **Developers:**  
  - Guy (207698911)  
  - Dan (325516052)

Developed as part of an assignment project influenced by classic arcade games and modern web development techniques.

## License

This project is licensed under the [MIT License](LICENSE).

---

*Enjoy playing Starships Game and feel free to provide feedback or contribute to the project!*