import Canvas from './canvas';
import Snake from './snake';
import Food from './food';
import GameStorage from './gameStorage';

export default class Game {
    constructor(canvasParams, playerName, scoreDOMEl, gameEndDOMEl, gameEndCallback) {
        this.canvas = new Canvas(canvasParams);
        this.snake = new Snake(canvasParams.gridSize, canvasParams.gridSize, canvasParams.gridSize);
        this.food = new Food(...this.getRandomFoodPosition(), canvasParams.gridSize);
        this.gameOn = true;
        this.rafID = null;
        this.score = 0;
        this.scoreDOMEl = scoreDOMEl;
        this.gameEndDOMEl = gameEndDOMEl;
        this.playerName = playerName;
        this.gameEndCallback = gameEndCallback;
        this.prepareGame();
    }

    prepareGame() {
        this.canvas.drawGridBackground();
        this.gameEndDOMEl.classList.remove('visible');
    }

    startGame() {
        this.resetGameScore();
        this.addKeyDownListener();
        requestAnimationFrame(this.gameProcess.bind(this));
    }

    endGame() {
        cancelAnimationFrame(this.rafID);
        this.removeKeyDownListener();
        this.gameEndDOMEl.classList.add('visible');
        if (this.score > 0) GameStorage.setPlayerScore(this.playerName, this.score);
        this.gameEndCallback();
    }

    gameProcess() {
        this.canvas.drawGridBackground();
        this.canvas.drawElements(this.snake, this.food);

        if (this.gameOn) {
            if (this.rafID % 5 === 0) {
                // Change snake direction if scheduled
                this.snake.changeDirection();
                // If snake collided with self / canvas edge stop the game
                if (this.snake.checkOffCanvas(this.canvas.cw, this.canvas.ch) || this.snake.checkSelfCollision()) {
                    this.gameOn = false;
                } else {
                    // Update position if no collision detected
                    this.snake.updatePosition();
                }

                if (this.snake.isFoodEaten(this.food)) {
                    this.snake.addTailPiece();
                    this.snake.paintTail(this.food.color);
                    this.resetFood();
                    this.updateGameScore();
                }
            }
            this.rafID = requestAnimationFrame(this.gameProcess.bind(this));
        } else {
            this.endGame();
        }
    }

    getRandomFoodPosition() {
        let maxGridWidth = this.canvas.cw / this.canvas.gridSize;
        let maxGridHeight = this.canvas.ch / this.canvas.gridSize;
        let xPosition, yPosition;
        let forbiddenPosition = this.snake.getSnakePosition();

        do {
            xPosition = (Math.random() * maxGridWidth|0) * this.canvas.gridSize;
            yPosition = (Math.random() * maxGridHeight|0) * this.canvas.gridSize;
        } while (forbiddenPosition.filter(snakePart => snakePart.x === xPosition && snakePart.y === yPosition).length > 0);

        return [xPosition, yPosition];
    }

    resetFood() {
        this.food = new Food(...this.getRandomFoodPosition(), this.canvas.gridSize);
    }

    resetGameScore() {
        this.score = 0;
        this.scoreDOMEl.innerText = 0;
    }

    updateGameScore () {
        this.score++;
        this.scoreDOMEl.innerText = this.score;
    }

    handleEvent(event) {
        if (event.type === 'keydown') {
            const keyCode = event.keyCode;
            if (keyCode === 38 || keyCode === 40 || keyCode === 37 || keyCode === 39) {
                event.preventDefault();
            }
            if (keyCode === 38 || keyCode === 87) {
                this.snake.scheduleMovementDirectionChange({x: 0, y: -1});
            } else if (keyCode === 40 || keyCode === 83) {
                this.snake.scheduleMovementDirectionChange({x: 0, y: 1});
            } else if (keyCode === 37 || keyCode === 65) {
                this.snake.scheduleMovementDirectionChange({x: -1, y: 0});
            } else if(keyCode === 39 || keyCode === 68) {
                this.snake.scheduleMovementDirectionChange({x: 1, y: 0});
            }
        }
    }

    addKeyDownListener() {
        document.addEventListener('keydown', this);
    }

    removeKeyDownListener() {
        document.removeEventListener('keydown', this);
    }
}