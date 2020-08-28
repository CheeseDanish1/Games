import {
    onSnake,
    expandSnake
} from './snake.js'
import {
    randomGridPosition
} from './grid.js'

let food = getRandomFoodPos()
const EXPANTION_RATE = 1

export function update() {
    if (onSnake(food)) {
        expandSnake(EXPANTION_RATE);
        food = getRandomFoodPos()
    }
}

export function draw(gameBoard) {
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