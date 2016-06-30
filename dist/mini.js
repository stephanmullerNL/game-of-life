

function gameOfLife(initial, width, height, maxGenerations) {

    const CELLS = width * height;
    const ALIVE = '#';
    const DEAD = '-';
    const NEIGHBOUR_CACHE = new Map();

    const isAlive = (i) => generation.has(String(i));
    const getCoordinates = (val, i) => {
        let coordinates = [i % width, Math.floor(i / width)];
        return String(coordinates);
    };

    let count = 0;
    let generation = initial.reduce((all, cell) => all.set(String(cell), cell), new Map());
    let allCoordinates = new Array(width * height).fill(0).map(getCoordinates);

    function init() {
        draw();
        nextGeneration();
    }

    function nextGeneration() {
        const getAllUniqueNeighbours = (all, cell) => {
            getNeighbours(cell).forEach((neighbour) => all.add(neighbour));
            return all;
        };

        let allNeighbours = [...generation.values()].reduce(getAllUniqueNeighbours, new Set());

        generation = [...allNeighbours].reduce((all, cell) => {
            let neighbours = (NEIGHBOUR_CACHE.get(String(cell)) || getNeighbours(cell));
            let aliveNeighbours = neighbours.filter(isAlive).length;

            let survive = aliveNeighbours === 2 && isAlive(cell);
            let reproduce = aliveNeighbours === 3;

            return (survive || reproduce) ? all.set(String(cell), cell) : all
        }, new Map());

        draw();

        if (count++ < maxGenerations && generation.size > 0) {
            setTimeout(nextGeneration, 0);
        }
    }

    function getNeighbours(cell) {
        let [x, y] = cell;

        const takeStep = ([stepX, stepY]) => [x + stepX, y + stepY];
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

        let neighbours = NEIGHBOUR_CACHE.get(String(cell));

        if(!neighbours) {
            neighbours = directions.map(takeStep);
            NEIGHBOUR_CACHE.set(String([cell]), neighbours);
        }

        return neighbours;
    }

    function draw() {
        let board = '';

        for (let i = 0; i < CELLS; i++) {
            board += generation.has(allCoordinates[i]) ? ALIVE : DEAD;

            if ((i + 1) % width === 0) {
                board += "\n";
            }
        }

        document.body.innerText = board;
    }

    init();
}