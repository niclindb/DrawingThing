// 5/8/2025
// Handles the client drawing

import * as socket from './socket.js';

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
setupDrawTool();


export function drawFromServer(pos) { // called from socket.js
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
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
    draw(e);
}

function endDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    
    const pos = getPosition(e);

    drawLineFromLastPosition(pos);

    socket.sendDrawToServer(pos)
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
canvas.addEventListener("touchstart", (e) => startDrawing(e.touches[0]));
canvas.addEventListener("touchend", endDrawing);
canvas.addEventListener("touchmove", (e) => {
    draw(e.touches[0]);
    e.preventDefault();
});
*/