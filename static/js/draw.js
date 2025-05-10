// 5/8/2025
// Handles the client drawing

import * as socket from './socket.js';

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
setupDrawTool();


export function drawFromServer(points, color, isNewPath) {
    if (isNewPath) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
    }
    ctx.strokeStyle = color;
    ctx.lineTo(points[0], points[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
}

let drawing = false;

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

function startDrawing(e) {
    drawing = true;
    const pos = getPosition(e);
    const color = document.getElementById("colorPicker").value;
    
    // Start a new path
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    // Tell server we're starting a new line
    socket.sendDrawToServer({
        points: {x: pos.x, y: pos.y},
        color: color,
        isNewPath: true 
    });
}

function endDrawing() {
    drawing = false;
    ctx.beginPath();  
}

function draw(e) {
    if (!drawing) return;
    
    const pos = getPosition(e);
    const color = document.getElementById("colorPicker").value;

    drawLineFromLastPosition(pos);

    socket.sendDrawToServer({
        points: {x: pos.x, y: pos.y},
        color: color,
        isNewPath: false
    });
}

function drawLineFromLastPosition(pos) {
    ctx.lineTo(pos.x, pos.y); // draw from last starting position to where you clicked
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y); // move the next starting position to where you clicked
}

function setupDrawTool() {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
}


canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mousemove", draw);
/*
// Touch support for mobile
canvas.addEventListener("touchstart", (e) => startDrawing(e.touchespoints.x));
canvas.addEventListener("touchend", endDrawing);
canvas.addEventListener("touchmove", (e) => {
    draw(e.touchespoints.x);
    e.preventDefault();
});
*/