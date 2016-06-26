(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = class {

    // TODO: Make entirely functional, move all DOM logic somewhere else
    constructor(element, width, height) {
        this.element = element;

        this.width = width;
        this.height = height;

        this.tiles = [];
        this.generation = [];
        this._previousGeneration = [];
        this._neighboursCache = {};

        // temp
        let pattern = [1, 42, 80, 81, 82];

        this.createGame(pattern);
    }

    /*** Controls ***/
    start() {
        this._stopped = false;

        // TODO: Work with checkpoints
        this.firstGeneration = this.getFirstGeneration();
        this.generation = this.firstGeneration;

        this.drawGeneration();

        this._timeout = setTimeout(this.live.bind(this), 1000);
    }

    reset() {
        this._previousGeneration = [];
        this.generation = this.firstGeneration;

        this.createGame(this.generation);
    }

    stop() {
        clearTimeout(this._timeout);
        this._stopped = true;
    }

    onStopped(fn) {
        this._onStopped = fn;
    }

    /*** Game ***/
    live() {
        const noDuplicates = (tile, index, all) => {
            return all.indexOf(tile) === index;
        };
        const addAllNeighbours = (all, tile) => {
            all = all.concat(this.getNeighbours(tile));
            return all;
        };

        let isUnchanged;

        // TODO: keep list of past generation hashes to check stabilization over multiple generations
        this._previousGeneration = [].concat(this.generation);

        this.generation = this.generation
            .reduce(addAllNeighbours, [])
            .filter(noDuplicates)
            .filter(this.getNextGeneration.bind(this));

        this.drawGeneration();

        // TODO: only track visible part of the generation
        isUnchanged = JSON.stringify(this._previousGeneration) === JSON.stringify(this.generation);

        if (this._stopped) {
            console.log('Game stopped by user');
        } else if (isUnchanged) {
            console.log('Equilibrium reached, aborting');
            this._onStopped();
        } else {
            this._timeout = setTimeout(this.live.bind(this), 250);
        }
    }

    /*** Tiles ***/
    getNextGeneration(currentTile) {
        const isAlive = (tile) =>  {
            return !!this.generation.find((genTile) => {
                    return genTile.x === tile.x && genTile.y === tile.y;
                });
        };
        let aliveNeighbours = this.getNeighbours(currentTile).filter(isAlive);

        const survive = aliveNeighbours.length === 2 && isAlive(currentTile);
        const reproduce = aliveNeighbours.length === 3;

        return (survive || reproduce);
    }

    getNeighbours(from) {
        const createNeighbour = (step) => {
            return {
                x: from.x + step.x,
                y: from.y + step.y
            };
        };
        const steps = [
            { x: -1, y: -1 },
            { x: -1, y:  0 },
            { x: -1, y:  1 },
            { x:  0, y: -1 },
            { x:  0, y:  1 },
            { x:  1, y: -1 },
            { x:  1, y:  0 },
            { x:  1, y:  1 }
        ];
        const index = from.x + ',' + from.y;

        if (!this._neighboursCache[index]) {
            this._neighboursCache[index] = steps.map(createNeighbour);
        }

        return this._neighboursCache[index];
    }

    toCoordinates(index) {
        return {
            x: Math.floor(index % this.width),
            y: Math.floor(index / this.width)
        }
    }

    toIndex(tile) {
        return tile.x + tile.y * this.width;
    }

    // TODO: Move to separate class
    /*** Render game ***/
    createGame(pattern = []) {
        this.element.innerHTML = '';
        this.tiles = [];

        for(let i = 0; i < this.width * this.height; i++) {
            let checkbox = document.createElement('input');
            let label = document.createElement('label');

            // TODO: Add event to update state by clicking during gameplay ?
            checkbox.type = 'checkbox';
            checkbox.id = i;
            checkbox.checked = pattern.indexOf(i) > -1;

            label.setAttribute('for', i);

            this.element.appendChild(checkbox);
            this.element.appendChild(label);

            this.tiles.push(checkbox);
        }
    }

    drawGeneration() {
        const inGrid = (tile) => {
            return tile.x < this.width && tile.y < this.height;
        };

        this._previousGeneration
            .filter(inGrid)
            .forEach((tile) => this.setState(tile, 'visited'));

        this.generation
            .filter(inGrid)
            .forEach((tile) => this.setState(tile, 'alive'));
    }

    getFirstGeneration() {
        const alreadyChecked = (element) => {
            return element.checked;
        };
        const getIndex = (element) => {
            return Number(element.id);
        };

        return this.tiles
            .filter(alreadyChecked)
            .map(getIndex)
            .map(this.toCoordinates.bind(this));
    }

    setState(tile, state) {
        const index = this.toIndex(tile);
        const element = this.tiles[index];

        if (!element) {
            return;
        }

        switch(state) {
            case 'alive':
                element.checked = true;
                element.indeterminate = false;
                break;
            case 'visited':
                element.indeterminate = true;
            // no break
            case 'dead':
            default:
                element.checked = false;
        }
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

        create();
    }

    function create() {
        stop();

        // todo: customize dimensions
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
        enable(elements.resetButton);
    }

    function reset() {
        disable(elements.resetButton);

        game && game.reset();
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
