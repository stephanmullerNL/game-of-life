const Tile = require('./Tile.js');

let directions;

module.exports = class {

    constructor(element, width, height) {
        this.element = element;
        this.canvas = element.getContext('2d');

        this.columns = width * 2 + 1;
        this.rows = height * 2 + 1;

        this.tiles = this.createTiles(width, height);
        this.path = [];

        directions = {
            left: -1,
            right: 1,
            up: -this.columns,
            down: this.columns
        };

        this.renderCanvas();
    }

    createTiles(width, height) {
        let tiles = [];

        const amount = (width * 2 + 1) * (height * 2 + 1);
        const maxDimension = Math.max(width, height);

        const wallSize = Math.ceil(40 / maxDimension);
        const roomSize = Math.floor((this.element.width - ((maxDimension + 1) * wallSize)) / maxDimension);

        for(let i = 0; i < amount; i++) {
            const col = this.getColumn(i);
            const row = this.getRow(i);

            const tile = new Tile(
                this.canvas,
                0,
                (Math.ceil(col / 2) * wallSize) + (Math.ceil(col / 2) - col % 2) * roomSize,
                (Math.ceil(row / 2) * wallSize) + (Math.ceil(row / 2) - row % 2) * roomSize,
                (col % 2) ? roomSize : wallSize,
                (row % 2) ? roomSize : wallSize
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
        this.tiles.forEach((tile) => tile.draw());
    }

    stop() {
        this._stopped = true;
    }

    /*** Helpers ***/
    getColumn(tile) {
        return Math.floor(tile % this.columns);
    }

    getRow(tile) {
        return Math.floor((tile) / this.columns);
    }

    isAdjacent(tile, next) {
        return this.getRow(tile) === this.getRow(next) || this.getColumn(tile) === this.getColumn(next);
    }

    isEdge(tile) {
        return this.getRow(tile) < 1 ||
            this.getColumn(tile) < 1 ||
            this.getRow(tile) > this.rows - 1 ||
            this.getColumn(tile) > this.columns - 1;
    }
};