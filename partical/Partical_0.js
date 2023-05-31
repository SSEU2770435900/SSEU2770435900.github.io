var canvas = document.getElementById("partical");
var context = canvas.getContext("2d");

const beta = 0.25;
const r_max = 256;
const frac = 0.5
const border = 16;

const width = 1024;
const height = 768;
const depth = 64;

canvas.width = width;
canvas.height = height;

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

function norm(x) {
    let square = 0;
    for (let dim = 0; dim < x.length; ++dim) {
        square += Math.pow(x[dim], 2);
    }
    return square
}

function trans(matrix) {
    let transposition = [];
    for (let j = 0; j < matrix[0].length; ++j) {
        transposition.push([]);
        for (let i = 0; i < matrix.length; ++i) {
            transposition[j].push(matrix[i][j]);
        }
    }
    return transposition;
}

function submatrix(matrix, row, col) {
    let sub = [];
    for (let i = 0; i < matrix.length; ++i) {
        if (i === row) {
            continue;
        }
        sub.push([]);
        for (let j = 0; j < matrix[0].length; ++j) {
            if (j === col) {
                continue;
            }
            sub[sub.length - 1].push(matrix[i][j]);
        }
    }
    return sub;
}

function det(square) {
    if (square.length === 1) {
        return square[0][0];
    }
    let determinant = 0;
    let minus = 1;
    for (let j = 0; j < square.length; ++j) {
        const sub = submatrix(square, 0, j);
        determinant += minus * square[0][j] * det(sub);
        minus = -minus;
    }
    return determinant;
}

const camera = {
    phi: 180,
    theta: 90,
    rho: 1024,
    orthographic: false,
    lateral_move: function(movement) {
        this.theta += movement;
        while (this.theta < 0) {
            this.theta += 360;
        }
        while (this.theta >= 360) {
            this.theta -= 360;
        }
    },
    longitudinal_move: function(movement) {
        this.phi += movement;
        if (this.phi < 0) {
            this.phi = 0;
        } else if (this.phi >= 180) {
            this.phi = 180;
        }
    },
    radial_move: function(movement) {
        this.rho *= Math.exp(movement / 512);
        if (this.rho < 0) {
            this.rho = 0;
        }
    },
    projection: function(point) {
        const sph = Math.sin(this.phi * Math.PI / 180);
        const cph = Math.cos(this.phi * Math.PI / 180);
        const sth = Math.sin(this.theta * Math.PI / 180);
        const cth = Math.cos(this.theta * Math.PI / 180);
        const i = [sth, -cth, 0];
        const j = [cph * cth, cph * sth, -sph];
        const k = [sph * cth, sph * sth, cph];
        const x = point.map((value, index) => value + this.rho * k[index]);
        let det_A = det([i, j, k]);
        let det_0 = det([x, j, k]);
        let det_1 = det([i, x, k]);
        let det_2 = det([i, j, x]);
        let ortho = [det_0 / det_A, det_1 / det_A, det_2 / det_A];
        if (this.orthographic) {
            return [ortho[0] + width / 2, ortho[1] + height / 2];
        }
        let khi = Math.atan2(ortho[0], ortho[2]);
        let upsilon = Math.atan2(ortho[1], ortho[2]);
        return [khi * 1024 + width / 2, upsilon * 1024 + height / 2];
    }
};

document.addEventListener("keydown", event => {
    switch(event.key) {
        case "Enter": {
            camera.orthographic = !camera.orthographic;
            break;
        }
    }
});

var cursor_pos = [0, 0];
var cursor_dragging = false;
canvas.addEventListener("mousedown", event => {
    cursor_pos[0] = event.x;
    cursor_pos[1] = event.y;
    cursor_dragging = true;
});
canvas.addEventListener("mouseup", () => cursor_dragging = false);
canvas.addEventListener("mousemove", event => {
    if (cursor_dragging) {
        camera.lateral_move(event.x - cursor_pos[0]);
        camera.longitudinal_move(cursor_pos[1] - event.y);
        cursor_pos[0] = event.x;
        cursor_pos[1] = event.y;
    }
});
canvas.addEventListener("wheel", event => {
    camera.radial_move(event.deltaY);
});

class Partical{
    constructor(color_index, x) {
        this.color_index = color_index ?? Math.floor(Math.random() * partical_colors.length);
        this.x = x ?? [width, height, depth].map(value => Math.floor(Math.random() * value - value / 2));
        this.dx = [0, 0, 0];
    }

    draw() {
        context.beginPath();
        context.arc(...camera.projection(this.x), 2, 0, 2 * Math.PI);
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
            if (partical.x[0] + width / 2 < border) {
                ddx[0] += 4;
            } else if (partical.x[0] - width / 2 >=  border) {
                ddx[0] -= 4;
            }
            if (partical.x[1] + height / 2 < border) {
                ddx[1] += 4;
            } else if (partical.x[1] - height / 2 >= border) {
                ddx[1] -= 4;
            }
            if (partical.x[2] + depth / 2 < border) {
                ddx[2] += 4;
            } else if (partical.x[2] - depth / 2 >= border) {
                ddx[2] -= 4;
            }
            partical.dx[0] = frac * partical.dx[0] + ddx[0];
            partical.dx[1] = frac * partical.dx[1] + ddx[1];
            partical.dx[2] = frac * partical.dx[2] + ddx[2];
        }

        context.clearRect(0, 0, width, height);

        const ground = [
            [1, 1],
            [-1, 1],
            [-1, -1],
            [1, -1]
        ].map(coord => camera.projection([coord[0] * width / 2, coord[1] * height / 2, -depth / 2]));
        context.beginPath();
        context.moveTo(...ground[ground.length - 1]);
        for (let vertex of ground) {
            context.lineTo(...vertex);
        }
        context.strokeStyle = "rgb(255, 255, 255)";
        context.stroke();
        context.closePath();

        for (let partical of this.list) {
            partical.move();
            partical.draw();
        }
    }
};

var partical_list = new ParticalList(1024);
setInterval(() => partical_list.update(), 32);
