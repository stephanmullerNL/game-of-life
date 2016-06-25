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