function gameOfLife(initial, width, height, maxGenerations) {

    const CELLS = width * height;
    const ALIVE = '#';
    const DEAD = '-';
    //const NEIGHBOUR_CACHE = new Map();

    const coordinatesToIndex = ([x, y]) => x + y * width;
    const indexToCoordinates = (i) => [i % width, Math.floor(i / width)];
    const isAlive = (i) => generation.includes(i);

    let generation = initial.map(coordinatesToIndex);
    let count = 0;

    function init() {
        draw();
        nextGeneration();
    }

    function nextGeneration() {
        const getAllUniqueNeighbours = (all, cell) => {
            getNeighbours(cell).forEach((neighbour) => all.add(neighbour));
            return all;
        };

        let allNeighbours = generation.reduce(getAllUniqueNeighbours, new Set());

        generation = [...allNeighbours].reduce((all, cell) => {
            let aliveNeighbours = getNeighbours(cell).filter(isAlive).length;

            let survive = aliveNeighbours === 2 && isAlive(cell);
            let reproduce = aliveNeighbours === 3;

            if(survive || reproduce) {
                all.push(cell);
            }

            return all;
        }, []);

        draw();

        if (count++ < maxGenerations && generation.length > 0) {
            setTimeout(nextGeneration, 100);
        } else console.log('end');
    }

    function getNeighbours(cell) {
        let [x, y] = indexToCoordinates(cell);

        const takeStep = ([stepX, stepY]) => [x + stepX, y + stepY];
        const inGrid = ([x, y]) => (x >= 0 && x < width) && (y >= 0 && y < height);
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

        return directions
                .map(takeStep)
                .filter(inGrid)
                .map(coordinatesToIndex);
    }


    function draw() {
        let board = '';

        for (let i = 0; i < CELLS; i++) {
            board += isAlive(i) ? ALIVE : DEAD;

            if ((i + 1) % width === 0) {
                board += "\n";
            }
        }

        document.body.innerText = board;
    }

    init();
}