

function gameOfLife(initial, width, height, maxGenerations) {

    const CELLS = width * height;
    const ALIVE = '#';
    const DEAD = '-';
    const NEIGHBOUR_CACHE = new Map();

    const isAlive = (i) => generation.has(i);
    const getCoordinates = (val, i) => {
        let coordinates = [i % width, Math.floor(i / width)];
        return String(coordinates);
    };

    let count = 0;
    let generation = new Set(initial.map(String));
    let allCells = new Array(CELLS).fill(0).map(getCoordinates);

    function init() {
        draw();
        nextGeneration();
    }

    function nextGeneration() {
        const getAllUniqueNeighbours = (all, cell) => {
            getNeighbours(cell).forEach((neighbour) => all.add(neighbour));
            return all;
        };

        let allNeighbours = [...generation].reduce(getAllUniqueNeighbours, new Set());

        generation = new Set([...allNeighbours].filter((cellString) => {
            let aliveNeighbours = getNeighbours(cellString).filter(isAlive).length;

            let survive = aliveNeighbours === 2 && isAlive(cellString);
            let reproduce = aliveNeighbours === 3;

            return (survive || reproduce)
        }));

        draw();

        if (count++ < maxGenerations && generation.size > 0) {
            setTimeout(nextGeneration, 0);
        }
    }

    function getNeighbours(cell) {
        const takeStep = ([stepX, stepY]) =>  {
            let [x, y] = cell.split(',').map(Number);
            return String([x + stepX, y + stepY]);
        };
        const directions = [
            [-1,-1],
            [-1, 0],
            [-1, 1],
            [ 0,-1],
            [ 0, 1],
            [ 1,-1],
            [ 1, 0],
            [ 1, 1]
        ];

        let neighbours = NEIGHBOUR_CACHE.get(cell);

        if(!neighbours) {
            neighbours = directions.map(takeStep);
            NEIGHBOUR_CACHE.set(cell, neighbours);
        }

        return neighbours;
    }

    function draw() {
        //const cellSet = new Set(generation);

        let board = '';


        for(let i = 0; i < CELLS; i++) {
            let cell = allCells[i];

            if(generation.has(cell)) board +=  ALIVE ;
            else board += DEAD;

            if ((i + 1) % width === 0) {
                board += "\n";
            }
        }

        document.body.innerText = board;
    }

    init();
}