// 5/8/2025
// Handles the client drawing

import * as socket from './socket.js';

type Point = {
    x: number;
    y: number;
}

export type DrawInfo = {
    points: Point;
    color: string;
    isNewPath: boolean;
}

const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

initCanvas();

export function drawFromServer(points: Point, color: string, isNewPath: boolean): void {
    if (!ctx) throw new Error("Could not get canvas context");
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

let drawing: boolean = false;

function getPosition(e: MouseEvent): Point {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startDrawing(e: MouseEvent): void {
    drawing = true;
    const pos = getPosition(e);
    const color = (document.getElementById("colorPicker") as HTMLInputElement).value;
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    
    socket.sendDrawToServer({
        points: pos, 
        color: color,
        isNewPath: true 
    });
}

function endDrawing(): void {
    drawing = false;
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.beginPath();
}

function draw(e: MouseEvent): void {
    if (!drawing) return;
    
        const pos = getPosition(e);
        const color = (document.getElementById("colorPicker") as HTMLInputElement).value;

    drawLineFromLastPosition(pos);

    socket.sendDrawToServer({
        points: pos, 
        color: color,
        isNewPath: false
    });
}

function drawLineFromLastPosition(pos: Point): void {
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function setupDrawTool(): void {
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
}
function initCanvas() {
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setupDrawTool();
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mousemove", draw);