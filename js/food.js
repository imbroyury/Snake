/*
 * Using a tiny library for generating nice dark colors
 * https://github.com/davidmerfield/randomColor
 */
import randomColor from '../libs/randomColor.min';

export default class Food {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = randomColor({luminosity: 'dark'});
    }

    draw(canvasCtx, canvasGridLineWidth) {
        canvasCtx.fillStyle = this.color;
        canvasCtx.fillRect(
            this.x + canvasGridLineWidth / 2,
            this.y + canvasGridLineWidth / 2,
            this.size - canvasGridLineWidth,
            this.size - canvasGridLineWidth
        );
    }
}