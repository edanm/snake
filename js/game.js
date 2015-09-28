console.log("game starting");


var BLOCK_SIZE = 20;
var CANVAS_WIDTH = BLOCK_SIZE * 30;
var CANVAS_HEIGHT = BLOCK_SIZE * 15;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

document.body.appendChild(canvas);


// Game logic
var isGameOver = false;
var fruitEaten = 0;
var snakeSpeed = 5 / 60; // How many moves per second we want to make.
var growBlockAmt = 0;

var directions = {
    "up": {x: 0, y: -1},
    "down": {x: 0, y: 1},
    "left": {x: -1, y: 0},
    "right": {x: 1, y: 0},
};

var STARTING_DIRECTION = "right";
var currentDirection = STARTING_DIRECTION;

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}


var Snake = function() {
    this.color = "#000",
    this.x = 60,
    this.y = 60,
    this.width = BLOCK_SIZE,
    this.height = BLOCK_SIZE,
    this.segments = [{x: 60, y: 60},
                        {x:40, y:60}];

    this.draw = function() {
        ctx.fillStyle = this.color;
        for (var i = 0, len = this.segments.length; i < len; i++) {
            seg = this.segments[i];

            // Create rectangles for each block of the segment.
            ctx.fillRect(seg.x, seg.y, this.width, this.height);
        }
    };

    this.isInBounds = function() {
        return this.x >= 0 && this.x <= CANVAS_WIDTH &&
            this.y >= 0 && this.y <= CANVAS_HEIGHT;
    };

    this.move = function() {
        // return;
        // snake.x += directions[currentDirection].x * + BLOCK_SIZE;
        // snake.y += directions[currentDirection].y * + BLOCK_SIZE;

        // Copy the first segment and move it, then delete the last segment.
        var segCopy =  {};
        segCopy.x = this.segments[0].x;
        segCopy.y = this.segments[0].y;
        // Move it.
        segCopy.x += directions[currentDirection].x * + BLOCK_SIZE;
        segCopy.y += directions[currentDirection].y * + BLOCK_SIZE;

        this.segments.unshift(segCopy);
        this.segments.pop();
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
function getRandomInt(min, max, roundTo) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    num = num - (num % roundTo);
    return num;
}

var Fruit = function() {
    this.color = "#ff0000",
    this.x = getRandomInt(20, CANVAS_WIDTH - 20, BLOCK_SIZE),
    this.y = getRandomInt(20, CANVAS_HEIGHT - 20, BLOCK_SIZE),
    this.width = BLOCK_SIZE,
    this.height = BLOCK_SIZE,

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

var fruit = new Fruit();

function gameOver() {
    isGameOver = true;
}

var directionChange = "";
var directionChangeSecond = "";

var processInput = function() {
    // We haven't processed a direction change yet:
    if (directionChange === "" ) {
        if (38 in keysDown) { // Player holding up.
            if (currentDirection === "left" ||
                    currentDirection === "right") {
                directionChange = "up";
            }
        }

        if (40 in keysDown) { // Player holding down.
            if (currentDirection === "left" ||
                    currentDirection === "right") {
                directionChange = "down";
            }
        }

        if (37 in keysDown) { // Player holding left.
            if (currentDirection === "up" ||
                    currentDirection === "down") {
                directionChange = "left";
            }
        }

        if (39 in keysDown) { // Player holding right.
            if (currentDirection === "up" ||
                    currentDirection === "down") {
                directionChange = "right";
            }
        }
    }
};

var lastMoveTime = timestamp();
var update = function() {
    if (isGameOver) {
        // Nothing to do!
        return;
    }

    var now = timestamp();

    processInput(); // Gets us the direction change.

    // Check if the snake should move.
    if (((now - lastMoveTime) / 1000) > snakeSpeed) {
        // if (directionChange.length >= 1) {
            // // currentDirection = directionChange[directionChange.length - 1];
            // console.log(directionChange);
            // currentDirection = directionChange.pop();
        // }

        // Check if we need to change direciton.
        if (directionChange !== "") {
            currentDirection = directionChange;
            directionChange = "";
        }
        lastMoveTime = now;
        snake.move();
    }

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

var now,
    dt   = 0,
    last = timestamp(),
    step = 1/60;

function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
        update(dt);
        dt = dt - step;
    }
    render(dt);
    last = now;
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
