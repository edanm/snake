console.log("game starting");

var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 300;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

document.body.appendChild(canvas);


// Game logic
var isGameOver = false;
var fruitEaten = 0;
var snakeSpeed = 4;

var directions = {
    "up": {x: 0, y: -1},
    "down": {x: 0, y: 1},
    "left": {x: -1, y: 0},
    "right": {x: 1, y: 0},
};

var STARTING_DIRECTION = "right";
var currentDirection = STARTING_DIRECTION;

var Snake = function() {
    this.color = "#000",
    this.x = 50,
    this.y = 50,
    this.width = 10,
    this.height = 10,
    this.segments = [{length: 1, direction:STARTING_DIRECTION}];

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.isInBounds = function() {
        return this.x >= 0 && this.x <= CANVAS_WIDTH &&
            this.y >= 0 && this.y <= CANVAS_HEIGHT;
    };

    this.move = function() {
        snake.x += directions[currentDirection].x * snakeSpeed;
        snake.y += directions[currentDirection].y * snakeSpeed;
    };

    this.isTouchingFruit = function(fruit) {
        if (this.x < fruit.x + fruit.width &&
                this.x + this.width > fruit.x &&
                this.y < fruit.y + fruit.height &&
                this.height + this.y > fruit.y) {
            return true;
        }
        else {
            return false;
        }
    };
};
var snake = new Snake();

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var Fruit = function() {
    this.color = "#ff0000",
    this.x = getRandomInt(20, CANVAS_WIDTH - 20),
    this.y = getRandomInt(20, CANVAS_HEIGHT - 20),
    this.width = 10,
    this.height = 10,

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

var fruit = new Fruit();

function gameOver() {
    isGameOver = true;
}


var processInput = function() {
    if (38 in keysDown) { // Player holding up.
        if (currentDirection === "left" ||
                currentDirection === "right") {
            currentDirection = "up";
        }
    }

    if (40 in keysDown) { // Player holding down.
        if (currentDirection === "left" ||
                currentDirection === "right") {
            currentDirection = "down";
        }
    }

    if (37 in keysDown) { // Player holding left.
        if (currentDirection === "up" ||
                currentDirection === "down") {
            currentDirection = "left";
        }
    }

    if (39 in keysDown) { // Player holding right.
        if (currentDirection === "up" ||
                currentDirection === "down") {
            currentDirection = "right";
        }
    }
};

var update = function() {
    if (isGameOver) {
        // Nothing to do!
        return;
    }

    processInput();

    snake.move();

    // Check if snake is out of bounds.
    if (!snake.isInBounds()) {
        gameOver();
    }

    if (snake.isTouchingFruit(fruit)) {
        fruitEaten++;
        // generate a new fruit.
        fruit = new Fruit();
    }
};

// Draw everything
var render = function () {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Score
    if (!isGameOver) {
        ctx.fillStyle = "#000";
        ctx.font = "10px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Apples eaten: " + fruitEaten, 5, 5);
    }
    else {
        ctx.fillStyle = "#000";
        ctx.font = "25px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Game Over!", 190, 200);
    }

    snake.draw();
    fruit.draw();
};




// Game loop
//

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

var now,
    dt   = 0,
    last = timestamp(),
    step = 1/30;

function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
        dt = dt - step;
        update(step);
    }
    render(dt);
    last = now;
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
