// Stretch: add a start screen
// Paddle Variables
let paddleWidth = 20;
let paddleHeight = 120;
let paddleSpeed = 8;
let leftPaddle, rightPaddle;

// Ball Variables
let ballRadius = 16;
let ball;

// Timer Variables
let timerText;
let timerDuration = 3000;

// Win Variables
let winner;
let leftScore = 0;
let rightScore = 0;
let winCondition = 11;

let areaPadding = 20;
let gameState = "playing";

// Image Variables
let birdSprite, leftPipeSprite, rightPipeSprite, backgroundSprite;
let backgroundWidth = 640;
let backgroundHeight = 360;
let backgroundSpeed = .5;
let background = [];

async function setup() {
  createCanvas(backgroundWidth, backgroundHeight);
  noStroke();

  birdSprite = await loadImage("Sprites/Bird.png");
  leftPipeSprite = await loadImage("Sprites/LeftPipe.png");
  rightPipeSprite = await loadImage("Sprites/RightPipe.png");
  backgroundSprite = await loadImage("Sprites/PongLandscape.png")

  leftPaddle = new Paddle(
    areaPadding + paddleWidth,
    height / 2 - paddleHeight / 2, leftPipeSprite
  );
  rightPaddle = new Paddle(
    width - areaPadding - 2 * paddleWidth,
    height / 2 - paddleHeight / 2, rightPipeSprite
  );
  ball = new Ball(width / 2, height / 2, ballRadius);
  nextRound();

  background.push(new Background(-backgroundWidth));
  background.push(new Background(0));
  background.push(new Background(backgroundWidth));

}

function draw() {
  for (let i = 0; i < background.length; i++) {
    background[i].show();
  }

  handleInput();

  if (gameState == "gameover") {
    gameOver();
    return;
  }

  leftPaddle.show();
  rightPaddle.show();
  leftPaddle.update();
  rightPaddle.update();

  handleText();

  if (gameState == "waiting") {
    timer();
  }

  if (gameState == "playing") {
    ball.show();
    ball.update();

    ball.checkWallBounce();
    ball.checkPaddleBounce(leftPaddle);
    ball.checkPaddleBounce(rightPaddle);
  }
}

function handleWinner() {
  if (leftScore < winCondition && rightScore < winCondition) {
    nextRound();
  } else {
    if ((leftScore = winCondition)) {
      winner = "LEFT PLAYER";
    } else {
      winner = "RIGHT PLAYER";
    }
    gameState = "gameover";
  }
}

function gameOver() {
  let gameOverSize = 25;
  let resetSize = 10;
  let fontPadding = 20;

  push();
  textAlign(CENTER, CENTER);
  textSize(gameOverSize);
  fill(200);
  text("GAMEOVER. " + winner + " WON!", width / 2, height / 2);
  textSize(resetSize);
  text("PRESS R TO PLAY AGAIN.", width / 2, height / 2 + fontPadding);
  pop();
}

function nextRound() {
  leftPaddle.reset();
  rightPaddle.reset();
  ball.reset();
  gameState = "waiting";
  startTime = millis();
}

function timer() {
  let elapsed = millis() - startTime;
  let timerText = "";
  let fontSize = 100;

  if (elapsed <= 1000) {
    timerText = "3";
  } else if (elapsed <= 2000) {
    timerText = "2";
  } else if (elapsed <= 3000) {
    timerText = "1";
  }

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(fontSize);
  text(timerText, width / 2, height / 2);
  pop();

  if (elapsed >= timerDuration) {
    gameState = "playing";
  }
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  winner = "";
  nextRound();
}

/* ----------------- Input ----------------- */
function handleInput() {
  if (keyIsDown("w")) {
    leftPaddle.velocity.y = -paddleSpeed;
  }
  if (keyIsDown("s")) {
    leftPaddle.velocity.y = paddleSpeed;
  }

  if (keyIsDown(UP_ARROW)) {
    rightPaddle.velocity.y = -paddleSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    rightPaddle.velocity.y = paddleSpeed;
  }
  if (keyIsDown("r") && gameState == "gameover") {
    resetGame();
  }
}

function keyReleased() {
  leftPaddle.velocity.y = 0;
  rightPaddle.velocity.y = 0;
}

/* ----------------- Classes ----------------- */
class Paddle {
  constructor(x, y, sprite) {
    this.sprite = sprite;
    this.position = createVector(x, y);
    this.width = paddleWidth;
    this.height = paddleHeight;
    this.velocity = createVector(0, 0);
  }

  update() {
    this.position.add(this.velocity);
    this.position.y = constrain(this.position.y, 0, height - this.height);
  }

  show() {
    image(this.sprite, this.position.x, this.position.y, this.width, this.height)
  }
  reset() {
    this.position.y = height / 2 - paddleHeight / 2;
  }
}

class Ball {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.radius = ballRadius;
    this.xSpeed = 4.5;
    this.ySpeed = 3.0;
    this.rotationSpeed = 0;

    this.velocity = createVector(
      random([-1, 1]) * this.xSpeed,
      random([-1, 1]) * this.ySpeed
    );
  }

  update() {
    this.position.add(this.velocity);
  }

  checkWallBounce() {
    if (
      this.position.y - this.radius <= 0 ||
      this.position.y + this.radius >= height
    ) {
      this.velocity.y *= -1;
      this.position.y = constrain(
        this.position.y,
        this.radius,
        height - this.radius
      );
      this.rotationSpeed += 10;
    }

    if (this.position.x < 0 - this.radius) {
      rightScore++;
      handleWinner();
      winner = "RIGHT PLAYER";
    }
    if (this.position.x > width + this.radius) {
      leftScore++;
      handleWinner();
      winner = "LEFT PLAYER";
    }
  }

  checkPaddleBounce(paddle) {
    const withinY =
      this.position.y > paddle.position.y &&
      this.position.y < paddle.position.y + paddle.height;
    const withinX =
      this.position.x + this.radius > paddle.position.x &&
      this.position.x - this.radius < paddle.position.x + paddle.width;

    if (withinX && withinY) {
      if (this.velocity.x < 0) {
        this.position.x = paddle.position.x + paddle.width + this.radius;
      } else {
        this.position.x = paddle.position.x - this.radius;
      }
      this.velocity.x *= -1;

      this.velocity.y +=
        (this.position.y - paddle.position.y - paddle.height / 2) * 0.1;
      this.rotationSpeed += 10;
    }
  }

  show() {
    push();
    imageMode(CENTER);
    translate(this.position.x, this.position.y);
    rotate(this.rotationSpeed);
    scale(Math.sign(this.velocity.x), 1);
    image(birdSprite, 0, 0, this.radius * 2, this.radius * 2)
    pop();
    this.rotationSpeed = max(0, this.rotationSpeed - 0.1);
  }

  reset() {
    this.position.set(width / 2, height / 2);

    this.velocity = createVector(
      random([-1, 1]) * this.xSpeed,
      random([-1, 1]) * this.ySpeed
    );
    this.rotation = 0;
    this.rotationSpeed = 0;
  }
}

class Background {
  constructor(x) {
    this.position = createVector(x, 0);
    this.backgroundWidth = backgroundWidth;
    this.backgroundHeight = backgroundHeight;
    this.backgroundSpeed = backgroundSpeed;
  }
  show() {
    image(backgroundSprite, this.position.x, this.position.y, this.backgroundWidth, this.backgroundHeight);

    this.position.x -= this.backgroundSpeed;

    if (this.position.x <= -this.backgroundWidth) {
      this.position.x = this.backgroundHeight * 2;
    }
  }
}

/* ----------------- UI Helpers ----------------- */
function drawCourt() {
  stroke(80);
  strokeWeight(2);
  for (let y = 10; y < height; y += 18) {
    line(width / 2, y, width / 2, y + 8);
  }
  noStroke();
}

function handleText() {
  let textY = 50;
  let scoreSize = 25;

  push();
  textAlign(CENTER, CENTER);
  textSize(scoreSize);
  fill(255);
  text(leftScore, width / 4, textY);
  text(rightScore, (3 * width) / 4, textY);
  pop();

  let conditionSize = 10;
  push();
  textAlign(CENTER, CENTER);
  textSize(conditionSize);
  fill(255);
  text("SCORE 11 TIMES TO WIN THE GAME", width / 2, textY);
  pop();
}
