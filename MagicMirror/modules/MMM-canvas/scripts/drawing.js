let canva , ctx
let draw_color = "white";
let draw_width = "2";
let is_drawing = false;
let startBackground = "black";

function initDrawing() {
    canva = document.getElementById("canvas");
    if (!canva) return;
    
    ctx = canva.getContext("2d");

    // initial background
    ctx.fillStyle = startBackground;
    ctx.fillRect(0, 0, canva.width, canva.height);

    // Touch events
    canva.addEventListener("touchstart", start, false);
    canva.addEventListener("touchmove", draw, false);
    canva.addEventListener("touchend", stop, false);
    
    // Mouse events
    canva.addEventListener("mousedown", start, false);
    canva.addEventListener("mousemove", draw, false);
    canva.addEventListener("mouseup", stop, false);
    canva.addEventListener("mouseout", stop, false);
}

function start(event) {
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - canva.offsetLeft, event.clientY - canva.offsetTop);
    event.preventDefault();
}

function draw(event) {
    if (is_drawing) {
        ctx.lineTo(event.clientX - canva.offsetLeft, event.clientY - canva.offsetTop);
        ctx.strokeStyle = draw_color;
        ctx.lineWidth = draw_width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    event.preventDefault();
}

function stop(event) {
    if (is_drawing) {
        ctx.stroke();
        ctx.closePath();
        is_drawing = false;
    }
    event.preventDefault();
}

function changeColor(element) {
    draw_color = element.style.backgroundColor;
}

function clearCanvas() {
    ctx.fillStyle = startBackground;
    ctx.clearRect(0, 0, canva.width, canva.height);
    ctx.fillRect(0, 0, canva.width, canva.height);
}