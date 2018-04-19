export default class Canvas {
    constructor({gridSize, gridLineWidth, shadeOfGray, canvasDOMEl}) {
        this.gray = shadeOfGray;
        this.gridSize = gridSize;
        this.gridLineWidth = gridLineWidth;
        this.canvas = canvasDOMEl;
        this.cw = canvasDOMEl.width;
        this.ch = canvasDOMEl.height;
        this.ctx = canvasDOMEl.getContext('2d');
    }

    drawGridBackground() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(0, 0, this.cw, this.ch);
        ctx.lineWidth = this.gridLineWidth;
        ctx.strokeStyle = `rgb(${this.gray}, ${this.gray}, ${this.gray})`;
        for (let i = 0; i <= this.cw; i += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.ch);
            ctx.stroke();
        }
        for (let i = 0; i <= this.ch; i += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(this.cw, i);
            ctx.stroke();
        }
    }

    drawElements(snake, food) {
        snake.draw(this.ctx, this.gridLineWidth, this.gridSize);
        food.draw(this.ctx, this.gridLineWidth, this.gridSize);
    }
}