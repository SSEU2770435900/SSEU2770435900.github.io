var canvas = document.getElementById("partical");
var context = canvas.getContext("2d");

canvas.width = 1024 * 2;
canvas.height = 768 * 2;

const beta = 0.25;
const r_max = 256;
const border = 64;
const depth = 16;

var partical_colors = [
    "rgb(255, 0, 0)",
    "rgb(255, 165, 0)",
    "rgb(255, 255, 0)",
    "rgb(0, 128, 0)",
    "rgb(0, 255, 255)",
    "rgb(0, 0, 255)",
    "rgb(128, 0, 128)"
];

var factor_matrix = new Array(partical_colors.length);
for (let i = 0; i < factor_matrix.length; ++i) {
    factor_matrix[i] = [];
    for (let j = 0; j < partical_colors.length; ++j) {
        factor_matrix[i].push(Math.random() * 2 - 1);
    }
}

function projection_0(x) {
    return x.slice(0, 2);
}

function projection(x) {
    let center = [canvas.width / 2, canvas.height / 2];
    let zoom = (depth * Math.pow(x[2], -0.75)) * 0.5 + 0.5;
    return [
        center[0] - zoom * (center[0] - x[0]),
        center[1] - zoom * (center[1] - x[1])
    ];
}

class Partical{
    constructor(color_index, x) {
        this.color_index = color_index ?? Math.floor(Math.random() * partical_colors.length);
        this.x = x ?? [canvas.width, canvas.height, depth].map(value => Math.floor(Math.random() * value));
        this.dx = [0, 0, 0];
    }

    draw() {
        context.beginPath();
        context.arc(...projection(this.x), 2, 0, 2 * Math.PI);
        context.fillStyle = partical_colors[this.color_index];
        context.fill();
        context.closePath();
    }

    move() {
        for (let dim = 0; dim < this.x.length; ++dim) {
            this.x[dim] += this.dx[dim];
        }
    }
};

function norm(x) {
    let square = 0;
    for (let dim = 0; dim < x.length; ++dim) {
        square += Math.pow(x[dim], 2);
    }
    return square
}

function force(r, a) {
    if (r < beta) {
        return r / beta - 1;
    }
    if (r < 1) {
        return a * (1 - Math.abs(2 * r - beta - 1) / (1 - beta));
    }
    return 0;
}

class ParticalList{
    constructor(count) {
        this.list = [];
        for (let i = 0; i < count ?? 0; ++i) {
            this.list.push(new Partical());
        }
    }

    update() {
        for (let partical of this.list) {
            let ddx = [0, 0, 0];
            for (let other_partical of this.list) {
                if (partical === other_partical) {
                    continue;
                }
                let delta_x = [
                    other_partical.x[0] - partical.x[0],
                    other_partical.x[1] - partical.x[1],
                    other_partical.x[2] - partical.x[2]
                ];
                let r = Math.sqrt(norm(delta_x));
                if (r > r_max) {
                    continue;
                }
                let f = force(
                    r / r_max,
                    factor_matrix[partical.color_index][other_partical.color_index]
                );
                let k = f / r;
                ddx[0] += k * delta_x[0];
                ddx[1] += k * delta_x[1];
                ddx[2] += k * delta_x[2];
            }
            if (partical.x[0] < border) {
                ddx[0] += 4;
            } else if (partical.x[0] >= canvas.width - border) {
                ddx[0] -= 4;
            }
            if (partical.x[1] < border) {
                ddx[1] += 4;
            } else if (partical.x[1] >= canvas.height - border) {
                ddx[1] -= 4;
            }
            if (partical.x[2] < border) {
                ddx[2] += 4;
            } else if (partical.x[2] >= depth - border) {
                ddx[2] -= 4;
            }
            let frac = 0.9;
            partical.dx[0] = frac * partical.dx[0] + ddx[0];
            partical.dx[1] = frac * partical.dx[1] + ddx[1];
            partical.dx[2] = frac * partical.dx[2] + ddx[2];
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let partical of this.list) {
            partical.move();
            partical.draw();
        }
    }
};

var partical_list = new ParticalList(1024);
setInterval(() => partical_list.update(), 32);
