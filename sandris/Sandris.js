function randBoolean(k = 0.5) {
    return Math.random() < k;
}
function randRange(limit) {
    return Math.floor(limit * Math.random());
}
function sleep(time) {
    let end = Date.now() + time;
    while (Date.now() < end) { }
}

var canvas = document.getElementById("sandris");
var context = canvas.getContext("2d");
canvas.width = 120;
canvas.height = 180;

var hNumb = 12;
var vNumb = 18;
var size = Math.floor(Math.min(canvas.width / hNumb, canvas.height / vNumb));

var score_screen = document.getElementById("score-screen");
var score_context = score_screen.getContext("2d");
score_screen.width = 768;
score_screen.heigt = 128;

var next_sandromino = document.getElementById("next-sandromino");
var next_sandromino_context = next_sandromino.getContext("2d");
next_sandromino.width = 768;
next_sandromino.height = 384;

function next_sandromino_display(shape, back, fore) {
    let left = 32;
    let top = 32;
    next_sandromino_context.fillStyle = back;
    next_sandromino_context.fillRect(0, 0, next_sandromino.width, next_sandromino.height / 2);
    next_sandromino_context.fillStyle = fore;
    next_sandromino_context.beginPath();
    next_sandromino_context.moveTo(left, top);
    next_sandromino_context.lineTo(left, top + 128);
    next_sandromino_context.lineTo(left + 48, top + 128);
    next_sandromino_context.lineTo(left + 48, top + 64);
    next_sandromino_context.lineTo(left + 80, top + 128);
    next_sandromino_context.lineTo(left + 128, top + 128);
    next_sandromino_context.lineTo(left + 128, top);
    next_sandromino_context.lineTo(left + 80, top);
    next_sandromino_context.lineTo(left + 80, top + 64);
    next_sandromino_context.lineTo(left + 48, top);
    next_sandromino_context.closePath();
    next_sandromino_context.fill();
    left += 192;
    next_sandromino_context.beginPath();
    next_sandromino_context.moveTo(left, top);
    next_sandromino_context.lineTo(left, top + 128);
    next_sandromino_context.lineTo(left + 128, top + 128);
    next_sandromino_context.lineTo(left + 128, top + 96);
    next_sandromino_context.lineTo(left + 48, top + 96);
    next_sandromino_context.lineTo(left + 48, top + 80);
    next_sandromino_context.lineTo(left + 128, top + 80);
    next_sandromino_context.lineTo(left + 128, top + 48);
    next_sandromino_context.lineTo(left + 48, top + 48);
    next_sandromino_context.lineTo(left + 48, top + 32);
    next_sandromino_context.lineTo(left + 128, top + 32);
    next_sandromino_context.lineTo(left + 128, top);
    next_sandromino_context.closePath();
    next_sandromino_context.fill();
    left += 192;
    next_sandromino_context.beginPath();
    next_sandromino_context.moveTo(left, top);
    next_sandromino_context.lineTo(left + 32, top + 64);
    next_sandromino_context.lineTo(left, top + 128);
    next_sandromino_context.lineTo(left + 48, top + 128);
    next_sandromino_context.lineTo(left + 64, top + 96);
    next_sandromino_context.lineTo(left + 80, top + 128);
    next_sandromino_context.lineTo(left + 128, top + 128);
    next_sandromino_context.lineTo(left + 96, top + 64);
    next_sandromino_context.lineTo(left + 128, top);
    next_sandromino_context.lineTo(left + 80, top);
    next_sandromino_context.lineTo(left + 64, top + 32);
    next_sandromino_context.lineTo(left + 48, top);
    next_sandromino_context.closePath();
    next_sandromino_context.fill();
    left += 192;
    next_sandromino_context.beginPath();
    next_sandromino_context.moveTo(left, top);
    next_sandromino_context.lineTo(left, top + 32);
    next_sandromino_context.lineTo(left + 32, top + 32);
    next_sandromino_context.lineTo(left + 32, top + 128);
    next_sandromino_context.lineTo(left + 96, top + 128);
    next_sandromino_context.lineTo(left + 96, top + 32);
    next_sandromino_context.lineTo(left + 128, top + 32);
    next_sandromino_context.lineTo(left + 128, top);
    next_sandromino_context.closePath();
    next_sandromino_context.fill();
    next_sandromino_context.fillStyle = "#000000";
    next_sandromino_context.strokeStyle = back;
    next_sandromino_context.lineWidth = 8;
    let rect = [8, next_sandromino.height / 2, next_sandromino.width - 16, next_sandromino.height / 2 + 2];
    next_sandromino_context.fillRect(...rect);
    next_sandromino_context.strokeRect(...rect);
    left = 320;
    top = 272;
    let top_plus_buttom = (ys => [Math.min(...ys) + Math.max(...ys)])(shape.map(block => block[0]));
    let left_plus_right = (xs => [Math.min(...xs) + Math.max(...xs)])(shape.map(block => block[1]));
    let translate = (i, j) => [left + 128 * (j - left_plus_right / 2), top + 32 * (i - top_plus_buttom / 2)];
    next_sandromino_context.fillStyle = fore;
    for (let block of shape) {
        next_sandromino_context.fillRect(...translate(...block), 128, 32);
    }
}

const BACKGROUND_COLOR = "#000000";
const SAND_COLOR = [
    "#800000",
    "#008000",
    "#000080",
    "#808000"
];
const SAND_BORDER_COLOR = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00"
];
const SAND_SHAPE = [
    [[0, 0], [1, 0], [2, 0], [3, 0]], // I
    [[0, 1], [1, 1], [2, 0], [2, 1]], // J
    [[0, 0], [1, 0], [2, 0], [2, 1]], // L
    [[0, 0], [0, 1], [1, 0], [1, 1]], // O
    [[0, 1], [0, 2], [1, 0], [1, 1]], // S
    [[0, 0], [0, 1], [0, 2], [1, 1]], // T
    [[0, 0], [0, 1], [1, 1], [1, 2]] // Z
];

function oriented(coord, center, orientation) {
    switch (orientation) {
        case 0: {
            return [coord[0], coord[1]];
        }
        case 1: {
            return [center[0] - center[1] + coord[1], center[1] + center[0] - coord[0]];
        }
        case 2: {
            return [2 * center[0] - coord[0], 2 * center[1] - coord[1]];
        }
        case 3: {
            return [center[0] + center[1] - coord[1], center[1] - center[0] + coord[0]];
        }
    }
}

var score_display = {
    digit_width: 64,
    number_bars: [
        [0, 1, 2, 4, 5, 6],
        [2, 5],
        [0, 2, 3, 4, 6],
        [0, 2, 3, 5, 6],
        [1, 2, 3, 5],
        [0, 1, 3, 5, 6],
        [0, 1, 3, 4, 5, 6],
        [0, 2, 5],
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 5, 6]
    ],
    bar(digit, ...positions) {
        let left = digit * this.digit_width;
        score_context.fillStyle = "#f0c020";
        for (let pos of positions) {
            score_context.beginPath();
            switch (pos) {
                case 0: {
                    score_context.moveTo(left + 24, 8);
                    score_context.lineTo(left + 16, 16);
                    score_context.lineTo(left + 24, 24);
                    score_context.lineTo(left + 40, 24);
                    score_context.lineTo(left + 48, 16);
                    score_context.lineTo(left + 40, 8);
                    break;
                }
                case 1: {
                    score_context.moveTo(left + 24, 24);
                    score_context.lineTo(left + 16, 16);
                    score_context.lineTo(left + 8, 24);
                    score_context.lineTo(left + 8, 56);
                    score_context.lineTo(left + 16, 64);
                    score_context.lineTo(left + 24, 56);
                    break;
                }
                case 2: {
                    score_context.moveTo(left + 56, 24);
                    score_context.lineTo(left + 48, 16);
                    score_context.lineTo(left + 40, 24);
                    score_context.lineTo(left + 40, 56);
                    score_context.lineTo(left + 48, 64);
                    score_context.lineTo(left + 56, 56);
                    break;
                }
                case 3: {
                    score_context.moveTo(left + 24, 56);
                    score_context.lineTo(left + 16, 64);
                    score_context.lineTo(left + 24, 72);
                    score_context.lineTo(left + 40, 72);
                    score_context.lineTo(left + 48, 64);
                    score_context.lineTo(left + 40, 56);
                    break;
                }
                case 4: {
                    score_context.moveTo(left + 24, 72);
                    score_context.lineTo(left + 16, 64);
                    score_context.lineTo(left + 8, 72);
                    score_context.lineTo(left + 8, 104);
                    score_context.lineTo(left + 16, 112);
                    score_context.lineTo(left + 24, 104);
                    break;
                }
                case 5: {
                    score_context.moveTo(left + 56, 72);
                    score_context.lineTo(left + 48, 64);
                    score_context.lineTo(left + 40, 72);
                    score_context.lineTo(left + 40, 104);
                    score_context.lineTo(left + 48, 112);
                    score_context.lineTo(left + 56, 104);
                    break;
                }
                case 6: {
                    score_context.moveTo(left + 24, 104);
                    score_context.lineTo(left + 16, 112);
                    score_context.lineTo(left + 24, 120);
                    score_context.lineTo(left + 40, 120);
                    score_context.lineTo(left + 48, 112);
                    score_context.lineTo(left + 40, 104);
                    break;
                }
            }
            score_context.closePath();
            score_context.fill();
        }
    },
    number(digit, n) {
        this.bar(digit, ...this.number_bars[n]);
    },
    display(score) {
        score_context.fillStyle = "#200400";
        score_context.fillRect(0, 0, score_screen.width, score_screen.height);
        for (let digit = 0; digit < score.length; ++digit) {
            this.number(11 - digit, parseInt(score[score.length - digit - 1]));
        }
    }
};

var epoch = {
    gamearea: new Array(canvas.height),
    accumulation: new Array(canvas.width),
    next_shape: SAND_SHAPE[randRange(SAND_SHAPE.length)],
    next_kind: randRange(4),
    score: 0,
    is_playing: true,
    interval_ids: [],
    deadline: 3 * size,
    operation_down: false,
    operation_horizon: 0,
    operation_rotation: 0,
    create_sandromino(shape, kind_index, x, y) {
        for (let block of shape) {
            let left = (x + block[1]) * size;
            let top = (y + block[0]) * size;
            for (let i = top; i < top + size; ++i) {
                for (let j = left; j < left + size; ++j) {
                    this.gamearea[i][j].kind = kind_index;
                    this.gamearea[i][j].controlled = true;
                }
            }
        }
        for (let i = y * size; i < (y + 4) * size; ++i) {
            for (let j = x * size; j < (x + 4) * size; ++j) {
                if (this.gamearea[i][j].controlled) {
                    let not_border = true;
                    for (let di = i - 2; di < i + 3; ++di) {
                        for (let dj = j - 2; dj < j + 3; ++dj) {
                            not_border &&= this.gamearea[di]?.[dj]?.kind >= 0;
                        }
                    }
                    this.gamearea[i][j].color = (not_border ? SAND_COLOR : SAND_BORDER_COLOR)[kind_index];
                }
            }
        }
    },
    swap(i_0, j_0, i_1, j_1) {
        [this.gamearea[i_0][j_0], this.gamearea[i_1][j_1]] = [this.gamearea[i_1][j_1], this.gamearea[i_0][j_0]];
    },
    *gen_connected_slices(kind, column, upper, lower) {
        let connected_upper, connected_lower;
        for (let i = 0; i < canvas.height; ) {
            while ((sand => sand?.walked || sand?.kind != null && sand?.kind !== kind)(this.gamearea[i]?.[column])) {
                ++i;
            }
            if (i >= lower) {
                break;
            }
            connected_upper = i;
            while ((sand => !sand?.walked && sand?.kind === kind)(this.gamearea[i]?.[column])) {
                ++i;
            }
            if (i <= upper) {
                continue;
            }
            connected_lower = i;
            for (let i = connected_upper; i < connected_lower; ++i) {
                this.gamearea[i][column].walked = true;
            }
            yield [connected_upper, connected_lower]
        }
    },
    connect_next(kind, column, upper, lower, farthest) {
        if (column >= 0 && column < canvas.width) {
            for (let slice of this.gen_connected_slices(kind, column, upper, lower)) {
                farthest = Math.max(farthest, this.connect_next(kind, column + 1, ...slice, farthest));
                farthest = Math.max(farthest, this.connect_next(kind, column - 1, ...slice, farthest));
            }
        }
        return Math.max(farthest, column);
    },
    update() {
        this.not_any_controlled = true;
        for (let j = 0; j < canvas.width; ++j) {
            for (let i = 0; i < this.accumulation[j]; ++i) {
                if (this.gamearea[i][j].controlled) {
                    this.not_any_controlled = false;
                }
            }
        }
    },
    create() {
        if (this.not_any_controlled) {
            let left_p_right_m_one = (xs => Math.min(...xs) + Math.max(...xs))(this.next_shape.map(value => value[1]));
            this.create_sandromino(this.next_shape, this.next_kind, (x => (x >> 1) + (x & 1 && randBoolean()))(hNumb - left_p_right_m_one - 1), 0);
            let shape = SAND_SHAPE[randRange(SAND_SHAPE.length)];
            let orientation = randRange(4);
            this.next_shape = shape.map(block => oriented(block, (v => [v, v])(Math.max(...shape.flatMap(value => value)) / 2), orientation));
            this.next_kind = randRange(4);
            next_sandromino_display(this.next_shape, SAND_BORDER_COLOR[this.next_kind], SAND_COLOR[this.next_kind]);
        }
    },
    fall() {
        let is_reversed = randBoolean();
        for (let i = canvas.height - 1; i > 0; --i) {
            is_reversed ^= randBoolean(0.0625);
            for (let j = 0; j < canvas.width; ++j) {
                let j_rev = is_reversed ? canvas.width - j - 1 : j;
                let up = this.gamearea[i - 1];
                let down = this.gamearea[i];
                if (up[j_rev].kind !== -1) {
                    let dj = (randBoolean() ? [0, -1, 1] : [0, 1, -1]).find(value => down[j_rev + value]?.kind === -1) ?? null;
                    if (dj !== null) {
                        this.swap(i - 1, j_rev, i, j_rev + dj);
                    }
                }
            }
        }
    },
    accumulate() {
        for (let j = 0; j < canvas.width; ++j) {
            for (let i = canvas.height - 1; ; --i) {
                if (!(this.gamearea[i]?.[j]?.kind >= 0)) {
                    if ((this.accumulation[j] = i + 1) < this.deadline) {
                        this.is_playing = false;
                    }
                    break;
                }
                this.gamearea[i][j].controlled = false;
            }
        }
    },
    eliminate() {
        for (let kind = 0; kind < 4; ++kind) {
            let is_eliminatable = this.connect_next(kind, 0, 0, canvas.height, 0) === canvas.width;
            for (let i = 0; i < canvas.height; ++i) {
                for (let j = 0; j < canvas.width; ++j) {
                    if (this.gamearea[i][j].walked) {
                        if (is_eliminatable) {
                            this.gamearea[i][j].highlighted = 4;
                            this.gamearea[i][j].kind = -1;
                            this.gamearea[i][j].color = BACKGROUND_COLOR;
                            this.gamearea[i][j].controlled = false;
                            score_display.display((++this.score).toString().padStart(12, "0"));
                        }
                        this.gamearea[i][j].walked = false;
                    }
                }
            }
        }
    },
    operate() {
        if (this.operation_down) {
            for (let i = canvas.height - 1; i >= 0; --i) {
                for (let j = 0; j < canvas.width; ++j) {
                    if (this.gamearea[i][j].controlled) {
                        let moved_i = i + size;
                        this.swap(i, j, moved_i < this.accumulation[j] ? moved_i : --this.accumulation[j], j);
                    }
                }
            }
        }
        switch (this.operation_horizon) {
            case -1: {
                for (let i = 0; i < canvas.height; ++i) {
                    for (let j = 0; j < canvas.width; ++j) {
                        if (this.gamearea[i][j].controlled) {
                            let moved_j = j - size;
                            if (this.gamearea[i][moved_j]?.kind === -1) {
                                this.swap(i, j, i, moved_j);
                            }
                        }
                    }
                }
                break;
            }
            case 1: {
                for (let i = 0; i < canvas.height; ++i) {
                    for (let j = canvas.width - 1; j >= 0; --j) {
                        if (this.gamearea[i][j].controlled) {
                            let moved_j = j + size;
                            if (this.gamearea[i][moved_j]?.kind === -1) {
                                this.swap(i, j, i, moved_j);
                            }
                        }
                    }
                }
                break;
            }
        }
        if (this.operation_rotation !== 0) {
            let coords = [];
            let moved_sands = [];
            let i_sum = 0;
            let j_sum = 0;
            for (let i = 0; i < canvas.height; ++i) {
                for (let j = 0; j < canvas.width; ++j) {
                    if (this.gamearea[i][j].controlled) {
                        coords.push([i, j]);
                        moved_sands.push({sand: {...this.gamearea[i][j]}});
                        i_sum += i;
                        j_sum += j;
                        this.gamearea[i][j] = {kind: -1, color: BACKGROUND_COLOR, controlled: false};
                    }
                }
            }
            let is_movable = true;
            for (let index = 0; index < coords.length; ++index) {
                let [moved_i, moved_j] = oriented(coords[index], [i_sum / coords.length, j_sum / coords.length], 2 - this.operation_rotation).map(Math.floor);
                if (this.gamearea[moved_i]?.[moved_j]?.kind !== -1) {
                    is_movable = false;
                    break;
                }
                moved_sands[index].moved_i = moved_i;
                moved_sands[index].moved_j = moved_j;
            }
            if (is_movable) {
                for (let {moved_i, moved_j, sand} of moved_sands) {
                    this.gamearea[moved_i][moved_j] = sand;
                }
            } else {
                for (let index = 0; index < coords.length; ++index) {
                    this.gamearea[coords[index][0]][coords[index][1]] = moved_sands[index].sand;
                }
            }
        }
        this.operation_down = false;
        this.operation_horizon = this.operation_rotation = 0;
    },
    display() {
        for (let i = 0; i < canvas.height; ++i) {
            for (let j = 0; j < canvas.width; ++j) {
                context.fillStyle = --this.gamearea[i][j].highlighted > 0 ? "#ffffff" : this.gamearea[i][j].color;
                context.fillRect(j, i, 1, 1);
            }
        }
        context.strokeStyle = this.is_playing ? "#80ffff" : "#ff0000";
        context.lineWidth = 1;
        context.moveTo(0, this.deadline);
        context.lineTo(canvas.width, this.deadline);
        context.stroke();
    },
    lose() {
        context.fillStyle = "#f0f0f0";
        context.fillRect(canvas.width * 0.25, canvas.height * 0.375, canvas.width * 0.5, canvas.height * 0.125);
        context.font = "auto Consolas";
        context.fillStyle = "#000000";
        context.fillText("YOU LOSE", canvas.width * 0.28125, canvas.height * 0.4375);
    },
    start() {
        for (let i = 0; i < canvas.height; ++i) {
            this.gamearea[i] = Array.from(new Array(canvas.width)).map(() => ({kind: -1, color: BACKGROUND_COLOR, controlled: false}));
        }
        for (let j = 0; j < canvas.width; ++j) {
            this.accumulation[j] = canvas.height - 1;
        }
        score_display.display((this.score = 0).toString().padStart(12, "0"));
        this.is_playing = true;
    },
    play() {
        let fall_time = Date.now();
        this.fall();
        fall_time = Date.now() - fall_time;
        score_display.display(fall_time.toString());
        this.interval_ids.push(setInterval(() => {
            if (this.is_playing) {
                this.update();
                this.create();
            }
        }, 250), setInterval(() => {
            if (this.is_playing) {
                this.fall();
            }
        }, 16), setInterval(() => {
            if (this.is_playing) {
                this.accumulate();
            }
        }, 64), setInterval(() => {
            if (this.is_playing) {
                this.eliminate();
            }
        }, 250), setInterval(() => {
            if (this.is_playing) {
                this.operate();
            }
        }, 64), setInterval(() => {
            this.display();
            if (!this.is_playing) {
                for (let time = 0; time < 3000; ) {
                    setTimeout(this.display.bind(this), time += 500);
                    setTimeout(this.lose, time += 500);
                }
                this.suspend();
            }
        }, 16));
        // this.interval_id =  setInterval(() => {
        //     if (this.is_playing) {
        //         this.update();
        //         this.create();
        //         this.fall();
        //         this.accumulate();
        //         this.eliminate();
        //         this.operate();
        //         this.display();
        //     } else {
        //         for (let time = 0; time < 3000; ) {
        //             setTimeout(this.display.bind(this), time += 500);
        //             setTimeout(this.lose, time += 500);
        //         }
        //         this.suspend();
        //     }
        // }, 16);
    },
    suspend() {
        for (let interval_id of this.interval_ids) {
            clearInterval(interval_id);
        }
        this.interval_ids = [];
        // clearInterval(this.interval_id);
        // this.interval_id = null;
    }
};

document.addEventListener("keydown", event => {
    switch (event.code) {
        case "ArrowUp": {
            epoch.operation_rotation = event.shiftKey ? 1 : -1;
            break;
        }
        case "ArrowRight": {
            epoch.operation_horizon = 1;
            break;
        }
        case "ArrowDown": {
            epoch.operation_down = true;
            break;
        }
        case "ArrowLeft": {
            epoch.operation_horizon = -1;
            break;
        }
    }
});

epoch.start();
epoch.play();
