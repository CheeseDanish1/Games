let inputDir = {
    x: 0,
    y: 0
}
let lastInputDir = {
    x: 0,
    y: 0
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastInputDir.y != 0) break;
            inputDir = {
                x: 0,
                y: -1
            }
            break;
        case 'w':
            if (lastInputDir.y != 0) break;
            inputDir = {
                x: 0,
                y: -1
            }
            break;
        case 'ArrowDown':
            if (lastInputDir.y != 0) break;
            inputDir = {
                x: 0,
                y: 1
            }
            break;
        case 's':
            if (lastInputDir.y != 0) break;
            inputDir = {
                x: 0,
                y: 1
            }
            break;
        case 'ArrowLeft':
            if (lastInputDir.x != 0) break;
            inputDir = {
                x: -1,
                y: 0
            }
            break;
        case 'a':
            if (lastInputDir.x != 0) break;
            inputDir = {
                x: -1,
                y: 0
            }
            break;
        case 'ArrowRight':
            if (lastInputDir.x != 0) break;
            inputDir = {
                x: 1,
                y: 0
            }
            break;
        case 'd':
            if (lastInputDir.x != 0) break;
            inputDir = {
                x: 1,
                y: 0
            }
            break;
    }
})

function getInputDir() {
    lastInputDir = inputDir
    return inputDir
}



const GRID_SIZE = 21;


function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1
    }
}

function outsideGrid(pos) {
    return (
        pos.x < 1 || pos.x > GRID_SIZE || pos.y < 1 || pos.y > GRID_SIZE
    )
}







let lastRenderTime = 0;
let gameOver = false;
const gameBoard = document.getElementById('game-board')

function main(currentTime) {

    if (gameOver) {
        if (confirm('You lost. Press ok to restart.')) {
            window.location = window.location.href;
        }
        return;
    }
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;
    lastRenderTime = currentTime;


    update();
    draw();
}

window.requestAnimationFrame(main)

function update() {
    updateSnake();
    updateFood();
    checkDeath();

}

function draw() {
    gameBoard.innerHTML = ''
    drawSnake(gameBoard)
    drawFood(gameBoard)
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeInter()
}




let SNAKE_SPEED = 10;
const snakeBody = [{
    x: 11,
    y: 11
}]
let newSegments = 0;

function updateSnake() {
    addSegmants()

    const inputDirection = getInputDir()
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = {
            ...snakeBody[i]
        }
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

function drawSnake(gameBoard) {
    snakeBody.forEach(segmant => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segmant.y;
        snakeElement.style.gridColumnStart = segmant.x;
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement)
    })
}

function expandSnake(amount) {
    newSegments += amount
}

function onSnake(position, {
    ignoreHead = false
} = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPosition(segment, position)
    })
}


function getSnakeHead() {
    return snakeBody[0]
}

function snakeInter() {
    return onSnake(snakeBody[0], {
        ignoreHead: true
    })
}

function equalPosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y

}

function addSegmants() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({
            ...snakeBody[snakeBody.length - 1]
        })
    }

    newSegments = 0;
}



let food = getRandomFoodPos()
const EXPANTION_RATE = 1

function updateFood() {
    if (onSnake(food)) {
        expandSnake(EXPANTION_RATE);
        food = getRandomFoodPos()
    }
}

function drawFood(gameBoard) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement)
}

function getRandomFoodPos() {
    let newFoodPos;
    while (newFoodPos == null || onSnake(newFoodPos)) {
        newFoodPos = randomGridPosition()
    }
    return newFoodPos
}