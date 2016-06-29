function gameOfLife(initial, width, height, maxGenerations) {

    const CELLS = width * height;
    const ALIVE = '#';
    const DEAD = '-';
    const NEIGHBOUR_CACHE = new Map();

    const getCoordinates = (i) => [i % width, Math.floor(i / width)];
    const isAlive = (cell) => {
        return !!generation.find(i => cell[0] === i[0] && cell[1] === i[1]);
    };

    let count = 0;
    let generation = initial;

    function init() {
        draw();
        nextGeneration();
    }

    function nextGeneration() {
        const getAllUniqueNeighbours = (all, cell) => {
            getNeighbours(cell).forEach((neighbour) => all.add(String(neighbour)));
            return all;
        };

        let allNeighbours = generation.reduce(getAllUniqueNeighbours, new Set());

        generation = [...allNeighbours].map(i => i.split(',').map(Number))
            .filter((cell) => {
                let aliveNeighbours = getNeighbours(cell).filter(isAlive).length;

                let survive = aliveNeighbours === 2 && isAlive(cell);
                let reproduce = aliveNeighbours === 3;

                return (survive || reproduce)
            });

        draw();

        if (count++ < maxGenerations && generation.length > 0) {
            setTimeout(nextGeneration, 0);
        }
    }

    function getNeighbours(cell) {
        let [x, y] = cell;

        const takeStep = ([stepX, stepY]) => [x + stepX, y + stepY];
        const directions = [ [-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1] ];

        let neighbours = NEIGHBOUR_CACHE.get(String(cell));

        if(!neighbours) {
            neighbours = directions.map(takeStep);
            NEIGHBOUR_CACHE.set(String(cell), neighbours);
        }

        return neighbours;
    }

    function draw() {
        let board = '';

        for (let i = 0; i < CELLS; i++) {
            board += isAlive(getCoordinates(i)) ? ALIVE : DEAD;

            if ((i + 1) % width === 0) {
                board += "\n";
            }
        }

        document.body.innerText = board;
    }

    init();
}