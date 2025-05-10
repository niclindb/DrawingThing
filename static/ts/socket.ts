// 5/8/2025
// Controls the interaction socket between the clients and the server

import { drawFromServer } from './draw.js';


interface Point {
    x: number;
    y: number;
}

interface DrawInfo {
    points: Point;
    color: string;
    isNewPath: boolean;
}

declare const io: any;  // This tells TypeScript that 'io' exists globally
const socket = io();

export function sendDrawToServer(lineInfo: DrawInfo): void {
    console.log("sending to server: ", lineInfo);
    socket.emit('draw_line', {
        points: lineInfo.points,
        color: lineInfo.color,
        isNewPath: lineInfo.isNewPath
    });
}

socket.on('draw_line', (data: DrawInfo) => {
    drawFromServer(data.points, data.color, data.isNewPath);
});

socket.on('message', (msg: string) => {
    const li = document.createElement("li");
    li.innerHTML = msg;
    document.getElementById("messages")?.appendChild(li);
});

socket.on("connect", () => {
    console.log("connected");
    const statusElement = document.getElementById("connection_status");
    statusElement?.classList.add("good");
    statusElement?.classList.remove("bad");
    if (statusElement) statusElement.innerHTML = "Connected";
});

socket.on("disconnect", () => {
    console.log("disconnected");
    const statusElement = document.getElementById("connection_status");
    statusElement?.classList.add("bad");
    statusElement?.classList.remove("good");
    if (statusElement) statusElement.innerHTML = "Disconnected";
});

export function sendMessage(): void {
    const input = document.getElementById("messageInput") as HTMLInputElement;
    const message = input.value;
    socket.send(message);
    input.value = '';
}

export function sendHello(): void {
    socket.emit("hello");
}

export function test(): void {
    console.log("TESTING THINGS");
}