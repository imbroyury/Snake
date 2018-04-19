export default class Snake {
    constructor (x, y, size) {
        this.size = size;
        this.movementDirection = {x: 1, y: 0};
        this.head = new SnakePart(x, y);
        this.headColor = '#000000';
        this.tail = [];
        this.tailColor = '#000000';
        this.directionChangeArray = [];
    }

    updatePosition() {
        // Head
        this.head.incrementPosition(this.movementDirection.x * this.size, this.movementDirection.y * this.size);
        // Tail
        if (this.tail.length > 0) {
            for (let i = this.tail.length - 1; i >= 0; i--) {
                if (i === 0) {
                    // Set first tail element to previous position of head
                    this.tail[i].setPosition(this.head.x - (this.movementDirection.x * this.size),
                        this.head.y - (this.movementDirection.y * this.size));
                } else {
                    // Update other tail elements
                    this.tail[i].setPosition(this.tail[i - 1].x, this.tail[i - 1].y);
                }
            }
        }
    }

    scheduleMovementDirectionChange(direction) {
        let directionToCompare = this.movementDirection;

        /*
         * If we have direction changes pushed we check against the last scheduled
         * direction rather than against current direction
         */
        if (this.directionChangeArray.length > 0) {
            directionToCompare = this.directionChangeArray[this.directionChangeArray.length - 1];
        }

        if (Math.abs(directionToCompare.x) !== Math.abs(direction.x) ||
            Math.abs(directionToCompare.y) !== Math.abs(direction.y)) {
            this.directionChangeArray.push(direction);
        }
    }

    changeDirection() {
        if (this.directionChangeArray.length > 0) {
            this.movementDirection = this.directionChangeArray.shift();
        }
    }
    // Canvas Edge Mode
    checkOffCanvas(width, height) {
        const dX = this.movementDirection.x * this.size;
        const dY = this.movementDirection.y * this.size;
        return this.head.x + dX >= width ||
               this.head.x + dX < 0 ||
               this.head.y + dY >= height ||
               this.head.y + dY < 0;
    }

    checkSelfCollision() {
        const dX = this.movementDirection.x * this.size;
        const dY = this.movementDirection.y * this.size;
        return this.tail.some(piece => piece.x === this.head.x + dX && piece.y === this.head.y + dY);
    }

    isFoodEaten(food) {
        return this.head.x === food.x && this.head.y === food.y;
    }

    // Add a new piece directly on head's position. It will be changed during updatePosition()
    addTailPiece() {
        this.tail.unshift(new SnakePart(this.head.x, this.head.y));
    }

    paintTail(color) {
        this.tailColor = color;
    }

    draw(canvasCtx, canvasGridLineWidth) {
        this.head.drawSelf(canvasCtx, canvasGridLineWidth, this.size, this.headColor);
        this.tail.forEach(piece => piece.drawSelf(canvasCtx, canvasGridLineWidth, this.size, this.tailColor));
    }

    getSnakePosition() {
        return [this.head, ...this.tail];
    }
}

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    incrementPosition(dX, dY) {
        this.x += dX;
        this.y += dY;
    }

    drawSelf (canvasCtx, canvasGridLineWidth, size, color) {
        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(
            this.x + canvasGridLineWidth / 2,
            this.y + canvasGridLineWidth / 2,
            size - canvasGridLineWidth,
            size - canvasGridLineWidth
        );
    }
}