module.exports = class {

    constructor(element, width, height) {
        this.element = element;

        this.width = width;
        this.height = height;

        this.tiles = [];
        this.generation = [];
        this._previousGeneration = [];

        // temp
        let pattern = [1, 42, 80, 81, 82];

        this.createGame(pattern);
    }

    /*** Play ***/
    start() {
        this._stopped = false;

        this.firstGeneration = this.getFirstGeneration();
        this.generation = this.firstGeneration;

        this.drawGeneration();

        this._timeout = setTimeout(this.live.bind(this), 1000);
    }

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
            .filter(this.nextGeneration.bind(this));

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

    getFirstGeneration() {
        const alreadyChecked = (element) => {
            return element.checked;
        };
        const getIndex = (element) => {
            return Number(element.id);
        };

        return this.tiles
                .filter(alreadyChecked)
                .map(getIndex);
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

    /*** Tiles ***/
    nextGeneration(tile) {
        const isAlive = (tile) =>  {
            return this.generation.indexOf(tile) > -1;
        };
        const aliveNeighbours = this.getNeighbours(tile).filter(isAlive);

        const survive = aliveNeighbours.length === 2 && isAlive(tile);
        const reproduce = aliveNeighbours.length === 3;

        // Cast to int
        return (survive || reproduce);
    }

    // TODO: Cacche neighbours?
    getNeighbours(from) {
        const steps = [
            -this.width - 1,
            -this.width,
            -this.width + 1,
            -1,
            1,
            this.width - 1,
            this.width,
            this.width + 1
        ];

        return steps.map(step => {
            return step + from;
        });
    }

    setState(tile, state) {
        let element = this.tiles[tile];

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

    // TODO: Move drawing to separate class
    drawGeneration() {
        this._previousGeneration.forEach((tile) => this.setState(tile, 'visited'));
        this.generation.forEach((tile) => this.setState(tile, 'alive'));
    }
};