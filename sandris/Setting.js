document.getElementById("geal").addEventListener("mousedown", () => {
    const curtain_style = document.getElementsByClassName("curtain")[0].style;
    curtain_style.display = curtain_style.display && curtain_style.display !== "none" ? "none" : "block";
});

const suspend_or_play_btn = document.getElementById("suspend-or-play");
suspend_or_play_btn.addEventListener("mousedown", () => {
    if (suspend_or_play_btn.querySelector("polygon")) {
        suspend_or_play_btn.innerHTML = `
            <rect class = "left" x = "20" y = "16" width = "8" height = "32" stroke = "rgb(255, 255, 255)"/>
            <rect class = "right" x = "36" y = "16" width = "8" height = "32" stroke = "rgb(255, 255, 255)"/>
        `;
        epoch.play();
    } else {
        suspend_or_play_btn.innerHTML = `
            <polygon points = "24, 18 24, 46 48, 32" stroke = "rgb(255, 255, 255)"/>
        `;
        epoch.suspend();
    }
});

document.getElementById("clear").addEventListener("mousedown", () => {
    epoch.suspend();
    epoch.start();
    epoch.play();
});

document.getElementById("direction").addEventListener("mousedown", () => {
    const direction_keys_style= document.getElementsByClassName("direction-keys")[0].style;
    direction_keys_style.display = direction_keys_style.display !== "none" ? "none" : "grid";
});

document.getElementById("direction-key-down").addEventListener("mousedown", () => epoch.operation_down = true);
document.getElementById("direction-key-left").addEventListener("mousedown", () => epoch.operation_horizon = -1);
document.getElementById("direction-key-right").addEventListener("mousedown", () => epoch.operation_horizon = 1);
document.getElementById("direction-key-rcw").addEventListener("mousedown", () => epoch.operation_rotation = -1);
document.getElementById("direction-key-cw").addEventListener("mousedown", () => epoch.operation_rotation = 1);
