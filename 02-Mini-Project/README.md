# Mini Project — Flappy Pong

### The Project
Recreated a simple Pong-style game using OOP principles.
Each paddle and ball is a class with its own properties and methods.
Aesthetics and sounds are a parody of the original Flappy Bird game.
The moving landscape is also a class with its own properties and methods.

### Features
- Aesthetics and sounds based on the original Flappy Bird Game.
- Collision detection using `dist()`.
- Score tracking and game-over states.
- Timer countdown once win condition has been met.
- Player controls via `W/S` and `↑/↓` keys.
- Game is reset via `R` key.

### ✍️ Reflection
I initially just set out to accomplish the necessary goals and later added some of the optional goals. I had already coded Pong by myself on Javascript before using this template, but I used this template for Flappy Pong just to see what Kapi did differently.

His input controls were placed outside of the classes because input controls apparently do not work well simultaneously in a class. Other than the `W/S` and `↑/↓` keys for movement control, the `R` key allows the game to be reset once one of the players have won. I approached the latter by creating a "gameover" state that switches to the "waiting" state after the key has been pressed, resulting in a timer. 

I'd say since I had already coded Pong beforehand, there weren't any new challenges faced while coding this as most of the code was already provided in the template. While coding my original Pong though, the most difficult challenge was the timer and the states system, as I didn't have those originally. They initially were booleans. I was also unfamiliar with the timer logic as I was more used to C#'s Coroutines. The timer logic works based on saving the startTime once the `R` key has been pressed and using that to calculate elapsed (millis - startTime) against timerDuration.

Honestly, another challenge was just not getting bored. Since I had already recreated Pong, I wanted to move on to other projects already. However, I decided to add aesthetics and a new Background class just to do something new. I still want to work on other things though. If I didn't eventually get bored, I would have added a Start Menu.