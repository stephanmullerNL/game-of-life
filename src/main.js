(function () {

    const Game = require('./Gane.js');

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
        const width = elements.width.value;
        const height = elements.height.value;

        stop();

        game = new Game(elements.game, width, height);
    }

    function start() {
        disable(elements.createButton);
        disable(elements.resetButton);

        game.start();
    }

    function stop() {
        game && game.stop();

        enable(elements.createButton);
        enable(elements.resetButton);
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