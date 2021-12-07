(function () {
    let game;
    let elements;

    function init() {
        elements = {
            game: document.getElementById('game'),

            // Create
            height: document.getElementById('height'),
            width: document.getElementById('width'),
            createButton: document.getElementById('create'),

            // Play
            startButton: document.getElementById('start'),
            stopButton: document.getElementById('stop'),

            clearButton: document.getElementById('clear'),
            resetButton: document.getElementById('reset'),

            // Other
            import: document.getElementById('import'),
            export: document.getElementById('export'),
            exportButton: document.getElementById('exportButton')
        };

        elements.createButton.addEventListener('click', create);
        elements.resetButton.addEventListener('click', reset);

        elements.startButton.addEventListener('click', start);
        elements.stopButton.addEventListener('click', stop);

        elements.exportButton.addEventListener('click', exportState);

        create();
    }

    function create() {
        stop();

        let importTiles = elements.import.value.split(',').map(Number);

        // todo: customize dimensions
        game = new window.Game(elements.game, 40, 40, importTiles);

        game.onStopped(stop);

        enable(elements.startButton);
    }

    function start() {
        enable(elements.stopButton);

        disable(elements.createButton);
        disable(elements.startButton);
        disable(elements.exportButton);

        game.start();
    }

    function stop() {
        game && game.stop();

        disable(elements.stopButton);
        enable(elements.createButton);
        enable(elements.startButton);
        enable(elements.resetButton);
        enable(elements.exportButton);
    }

    function reset() {
        disable(elements.resetButton);

        game && game.reset();
    }

    function exportState() {
        let tiles = game && game.exportTiles() || '';

        elements.export.value = tiles;
    }

    function disable(element) {
        element.setAttribute('disabled', 'disabled');
    }

    function enable(element) {
        element.removeAttribute('disabled');
    }

    window.initGame = init
}());