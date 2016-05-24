const Tile = require('./Tile.js');

let directions;

module.exports = class {

    constructor(element, width, height) {
        this.element = element;
        this.canvas = element.getContext('2d');

        this.width = width;
        this.height = height;

        this.tiles = this.createTiles(width, height);
        this.path = [];

        directions = {
            left: -1,
            right: 1,
            up: -width,
            down: width
        };

        this.renderCanvas();
    }

    createTiles(width, height) {
        let tiles = [];

        const maxDimension = Math.max(width, height);
        const amount = width * height;

        this.tileSize = (this.element.width - maxDimension) / maxDimension;

        for(let i = 0; i < amount; i++) {
            const col = this.getColumn(i);
            const row = this.getRow(i);

            const tile = new Tile(
                this.canvas,
                false,
                col * this.tileSize + col,
                row * this.tileSize + row,
                this.tileSize,
                this.tileSize
            );

            tiles.push(tile);
        }

        return tiles;
    }


    /*** Play ***/
    start() {
        // TODO
    }

    getNextTile(tile, direction) {
        let next = tile + directions[direction];

        return this.isAdjacent(tile, next) ? next : null;
    }

    /*** Render game ***/
    renderCanvas() {
        this.canvas.clearRect(0, 0, this.element.width, this.element.height);

        this.renderGrid();

        this.tiles.forEach((tile) => tile.draw());
    }

    renderGrid() {
        this.canvas.lineWidth = '1';
        this.canvas.strokeStyle = 'black';

        const maxWidth = this.width * this.tileSize + this.width;
        const maxHeight = this.width * this.tileSize + this.width;

        for(let i = 1; i < this.width; i++) {
            const offset = i * this.tileSize + i;

            this.canvas.beginPath();
            this.canvas.moveTo(offset, 0);
            this.canvas.lineTo(offset, maxHeight);
            this.canvas.stroke();
        }

        for(let i = 1; i < this.height; i++) {
            const offset = i * this.tileSize + i;

            this.canvas.beginPath();
            this.canvas.moveTo(0, offset);
            this.canvas.lineTo(maxWidth, offset);
            this.canvas.stroke();
        }
    }

    stop() {
        this._stopped = true;
    }

    /*** Helpers ***/
    getColumn(tile) {
        return Math.floor(tile % this.width);
    }

    getRow(tile) {
        return Math.floor(tile / this.width);
    }

    isAdjacent(tile, next) {
        return this.getRow(tile) === this.getRow(next) || this.getColumn(tile) === this.getColumn(next);
    }
};