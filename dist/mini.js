function gameOfLife(initial, width, height, maxGenerations) {

    const CELLS = width * height;
    const ALIVE = '#';
    const DEAD = '-';
    //const NEIGHBOUR_CACHE = new Map();

    const coordinatesToIndex = ([x, y]) => x + y * width;
    const isAlive = i => generation.includes(i);

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

            let survive = aliveNeighbours.length === 2 && isAlive(cell);
            let reproduce = aliveNeighbours.length === 3;

            if(survive || reproduce) {
                all.push(cell);
            }
            return all;
        }, []);

        draw();

        if (count++ < maxGenerations && generation.length > 0) {
            setTimeout(nextGeneration, 100);
        }
    }

    function getNeighbours(cell) {
        const directions = [
            -1 - width,
            -1 + width,
            -1,
             1 - width,
             1 + width,
             1,
            -width,
             width
        ];

        return directions
                .map(direction => cell + direction)
                .filter(cell => cell > -1 && cell < CELLS);
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