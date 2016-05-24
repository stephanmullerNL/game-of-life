(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./Tile.js":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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

        game = new Game(elements.game, 50, 50);

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
},{"./Game.js":1}]},{},[3]);
