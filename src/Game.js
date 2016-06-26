let neighbourCache = {};
let stopped = false;
let timeout;
let onStopCallback;

module.exports = class {

    // TODO: Make entirely functional, move all DOM logic somewhere else
    constructor(element, width, height, imported) {
        this.element = element;

        this.width = width;
        this.height = height;

        this.tiles = [];
        this.generation = [];
        this._previousGeneration = [];

        this.createGame(imported);
    }

    /*** Controls ***/
    start() {
        this._stopped = false;
        this.element.classList.add('active');

        // TODO: Work with checkpoints
        this.firstGeneration = this.getFirstGeneration();
        this.generation = this.firstGeneration;

        this.drawGeneration();

        this._timeout = setTimeout(this.live.bind(this), 1000);
    }

    reset() {
        let pattern;

        this._previousGeneration = [];
        this.generation = this.firstGeneration;

        pattern = this.generation
                    .map(this.toIndex.bind(this));

        this.createGame(pattern);
    }

    stop() {
        clearTimeout(this._timeout);
        this._stopped = true;
        this.element.classList.remove('active');
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

        this._previousGeneration = this.generation;

        this.generation = this.generation
            .reduce(addAllNeighbours, [])
            .filter(noDuplicates)
            .filter(this.getNextGeneration.bind(this));

        this.drawGeneration();

        isUnchanged = this.isUnchanged();

        if (this._stopped) {
            console.log('Game stopped by user');
        } else if (isUnchanged) {
            console.log('Equilibrium reached, aborting');
            this._onStopped();
        } else {
            this._timeout = setTimeout(this.live.bind(this), 250);
        }
    }

    isUnchanged() {
        let previousVisible = this._previousGeneration.filter(this.isInGrid.bind(this));
        let currentVisible = this.generation.filter(this.isInGrid.bind(this));

        return JSON.stringify(previousVisible) === JSON.stringify(currentVisible);
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

        if (!neighbourCache[index]) {
            neighbourCache[index] = steps.map(createNeighbour);
        }

        return neighbourCache[index];
    }

    isInGrid(tile) {
        return tile.x < this.width && tile.y < this.height;
    };

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
        console.log('create', pattern);

        for(let i = 0; i < this.width * this.height; i++) {
            let checkbox = document.createElement('input');
            let label = document.createElement('label');

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
        this._previousGeneration
            .filter(this.isInGrid.bind(this))
            .forEach((tile) => this.setState(tile, 'visited'));

        this.generation
            .filter(this.isInGrid.bind(this))
            .forEach((tile) => this.setState(tile, 'alive'));
    }

    exportTiles() {
        return this.tiles
            .filter((tile) => tile.checked)
            .map((tile) => Number(tile.id))
            .join(',');
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