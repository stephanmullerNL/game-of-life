const colors = ['white', 'black'];

module.exports = class {

    constructor(canvas, alive, x, y, width, height) {
        this.canvas = canvas;

        this.alive = alive;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this._highlighted = false;
    }

    draw(color) {
        color = color || colors[+this.alive]; // Cast alive to an int

        this.canvas.fillStyle = color;
        this.canvas.fillRect(this.x, this.y, this.width, this.height);
    }

    highlight() {
        this._highlighted = true;
        this.draw('hotpink');
    }

    reset() {
        this._highlighted = false;
        this.draw();
    }

    setAlive(alive) {
        this.alive = alive;
        this.draw();
    }
};