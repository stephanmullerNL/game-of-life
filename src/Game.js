module.exports = class {

    constructor(element, width, height) {
        this.element = element;

        this.width = width;
        this.height = height;

        this.tiles = [];
        this.generation = [];
        this._previousGeneration = [];

        this.createGame();
    }

    /*** Play ***/
    start() {
        this._stopped = false;

        // TODO: implement drawing of starting tiles
        let pattern = [1351, 1352, 1353, 1313, 1272];
        pattern = pattern.concat([256, 257, 258, 259, 260, 261, 262, 263, 264, 265]);

        this.generation = pattern;

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
        this._previousGeneration = [].concat(this.generation);

        this.generation = this.generation
            .reduce(allNeighbours, [])
            .filter(noDuplicates)
            .filter(this.nextGeneration.bind(this));

        this.drawGeneration();

        isUnchanged = JSON.stringify(this._previousGeneration) === JSON.stringify(this.generation);

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

    setState(tile, state) {
        let element = this.tiles[tile];
console.log(tile, state, element);
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

    /*** Render game ***/
    createGame() {
        for(let i = 0; i < this.width * this.height; i++) {
            let checkbox = document.createElement('input');
            let label = document.createElement('label');

            checkbox.type = 'checkbox';
            checkbox.id = i;

            label.setAttribute('for', i);

            this.element.appendChild(checkbox);
            this.element.appendChild(label);

            this.tiles.push(checkbox);
        }
    }

    drawGeneration() {
        console.log('draw generation', this._previousGeneration, this.generation);
        this._previousGeneration.forEach((tile) => this.setState(tile, 'visited'));
        this.generation.forEach((tile) => this.setState(tile, 'alive'));
    }
};