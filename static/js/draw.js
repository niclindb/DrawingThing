// 5/8/2025
// Handles the client drawing
import * as socket from './socket.js';
var resizeTimeout;
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
initCanvas();
export function drawFromServer(points, color, isNewPath) {
    if (!ctx)
        throw new Error("Could not get canvas context");
    if (isNewPath) {
        ctx.beginPath();
        ctx.moveTo(points.x, points.y);
    }
    ctx.strokeStyle = color;
    ctx.lineTo(points.x, points.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(points.x, points.y);
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
    if (!ctx)
        throw new Error("Could not get canvas context");
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    socket.sendDrawToServer({
        points: pos,
        color: color,
        isNewPath: true
    });
}
function endDrawing() {
    drawing = false;
    if (!ctx)
        throw new Error("Could not get canvas context");
    ctx.beginPath();
}
function draw(e) {
    if (!drawing)
        return;
    const pos = getPosition(e);
    const color = document.getElementById("colorPicker").value;
    drawLineFromLastPosition(pos);
    socket.sendDrawToServer({
        points: pos,
        color: color,
        isNewPath: false
    });
}
function drawLineFromLastPosition(pos) {
    if (!ctx)
        throw new Error("Could not get canvas context");
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}
function setupDrawTool() {
    if (!ctx)
        throw new Error("Could not get canvas context");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
}
function scaleCanvas() {
    var scaleDelay = 250; // ms before the canvas actually scales after being still
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(forceScaleCanvas, scaleDelay);
}
function forceScaleCanvas() {
    if (!ctx)
        throw new Error("Could not get canvas context");
    const imageDataURL = canvas.toDataURL();
    ctx.canvas.width = window.innerWidth - 80;
    ctx.canvas.height = window.innerHeight - 120;
    const image = new Image();
    image.src = imageDataURL;
    image.onload = function () {
        ctx.drawImage(image, 0, 0);
    };
    updateCanvas();
}
function updateCanvas() {
    if (!ctx)
        throw new Error("Could not get canvas context");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setupDrawTool();
}
function initCanvas() {
    if (!ctx)
        throw new Error("Could not get canvas context");
    scaleCanvas();
    updateCanvas();
}
function updateWindowScale() {
    scaleCanvas();
}
//* EVENTS ---------------------------------------------
window.addEventListener('resize', updateWindowScale, true);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mousemove", draw);
