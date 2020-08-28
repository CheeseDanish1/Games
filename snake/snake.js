import { getInputDir } from "./input.js";

export let SNAKE_SPEED = 10;
const snakeBody = [{ x: 11, y: 11 }]
let newSegments = 0;

console.log("Started")

export function update() {

    addSegmants()

    const inputDirection = getInputDir()
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

export function draw(gameBoard) {
    snakeBody.forEach(segmant => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segmant.y;
        snakeElement.style.gridColumnStart = segmant.x;
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement)
    })
}

export function expandSnake(amount) {
    newSegments += amount
}

export function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPosition(segment, position)
    })
}


export function getSnakeHead() {
    return snakeBody[0]
}

export function snakeInter() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}

function equalPosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y

}

function addSegmants() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    }

    newSegments = 0;
}