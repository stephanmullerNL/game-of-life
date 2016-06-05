(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = class {

    constructor(element, width, height) {
        const maxDimension = Math.max(width, height);

        this.element = element;
        this.canvas = element.getContext('2d');

        this.width = width;
        this.height = height;

        this.tiles = [];
        this._previousGeneration = [];

        this.tileSize = (this.element.width - maxDimension) / maxDimension;

        this.renderCanvas();
    }

    /*** Play ***/
    start() {
        this._stopped = false;

        // TODO: implement drawing of starting tiles
        let pattern = [1351, 1352, 1353, 1313, 1272];
        pattern = pattern.concat([256, 257, 258, 259, 260, 261, 262, 263, 264, 265]);

        pattern.forEach((index) => {
            this.tiles.push({
                x: Math.floor(index % this.width),
                y: Math.floor(index / this.width)
            });
        });

        this.drawGeneration();

        setTimeout(this.live.bind(this), 1000);
    }

    live() {
        const noDuplicates = (tile, index, all) => index === this.getIndex(tile, all);
        const allNeighbours = (all, tile) => {
            all = all.concat(this.getNeighbours(tile));
            return all;
        };

        let isUnchanged;

        // TODO: keep list of past generation hashes to check stabilization over multiple generations
        this._previousGeneration = [].concat(this.tiles);

        this.tiles = this.tiles
            .reduce(allNeighbours, [])
            .filter(noDuplicates)
            .filter(this.nextGeneration.bind(this));

        this.drawGeneration();

        isUnchanged = JSON.stringify(this._previousGeneration) === JSON.stringify(this.tiles);

        if (this._stopped) {
            console.log('Game stopped by user');
        } else if (isUnchanged) {
            console.log('Equilibrium reached, aborting');
            this._onStopped();
        } else {
            setTimeout(this.live.bind(this), 250);
        }
    }

    stop() {
        this._stopped = true;
    }

    onStopped(fn) {
        this._onStopped = fn;
    }

    /*** Tiles ***/
    nextGeneration(tile) {
        const isAlive = (tile) => this.getIndex(tile) > -1;
        const aliveNeighbours = this.getNeighbours(tile).filter(isAlive);

        const survive = aliveNeighbours.length === 2 && isAlive(tile);
        const reproduce = aliveNeighbours.length === 3;

        // Cast to int
        return (survive || reproduce);
    }

    getNeighbours(from) {
        const steps = [
            { x: -1, y: -1},
            { x: -1, y: 0 },
            { x: -1, y: 1},
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: -1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 }
        ];

        return steps.map(step => ({
            x: from.x + step.x,
            y: from.y + step.y
        }));
    }

    getIndex(tile, list = this.tiles) {
        const sameTile = (currentTile) => currentTile.x === tile.x && currentTile.y === tile.y;

        return list.findIndex(sameTile);
    }

    /*** Render game ***/
    renderCanvas() {
        this.canvas.clearRect(0, 0, this.element.width, this.element.height);
        this.renderGrid();
    }

    renderGrid() {
        this.canvas.lineWidth = '1';
        this.canvas.strokeStyle = 'black';

        const maxWidth = this.width * this.tileSize + 2;
        const maxHeight = this.width * this.tileSize + 2;

        for(let i = 0; i < this.width + 1; i++) {
            const offset = i * this.tileSize + 1;

            this.canvas.beginPath();
            this.canvas.moveTo(offset, 0);
            this.canvas.lineTo(offset, maxHeight);
            this.canvas.stroke();
        }

        for(let i = 0; i < this.height + 1; i++) {
            const offset = i * this.tileSize + 1;

            this.canvas.beginPath();
            this.canvas.moveTo(0, offset);
            this.canvas.lineTo(maxWidth, offset);
            this.canvas.stroke();
        }
    }

    drawTile(tile, color) {
        this.canvas.fillStyle = color;
        this.canvas.fillRect(tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
    }

    drawGeneration() {
        this._previousGeneration.forEach((tile) => this.drawTile(tile, 'silver'));
        this.tiles.forEach((tile) => this.drawTile(tile, 'black'));

        this.renderGrid();
    }
};
},{}],2:[function(require,module,exports){
(function () {

    const Game = require('./Game.js');

    const elements = {
        game: document.getElementById('game'),

        // Create
        height: document.getElementById('height'),
        width: document.getElementById('width'),
        createButton: document.getElementById('create'),

        // Play
        startButton: document.getElementById('start'),
        stopButton: document.getElementById('stop'),

        clearButton: document.getElementById('clear'),
        resetButton: document.getElementById('reset')
    };

    let game;

    function init() {
        elements.createButton.addEventListener('click', create);
        elements.resetButton.addEventListener('click', reset);

        elements.startButton.addEventListener('click', start);
        elements.stopButton.addEventListener('click', stop);
    }

    function create() {
        stop();

        game = new Game(elements.game, 40, 40);

        game.onStopped(stop);

        enable(elements.startButton);
    }

    function start() {
        enable(elements.stopButton);

        disable(elements.createButton);
        disable(elements.startButton);

        game.start();
    }

    function stop() {
        game && game.stop();

        disable(elements.stopButton);
        enable(elements.createButton);
        enable(elements.startButton);
    }

    function reset() {
        // TODO
    }

    function disable(element) {
        element.setAttribute('disabled', 'disabled');
    }

    function enable(element) {
        element.removeAttribute('disabled');
    }

    init();
}());
},{"./Game.js":1}]},{},[2]);
