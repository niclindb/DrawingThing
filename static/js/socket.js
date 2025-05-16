// 5/8/2025
// Controls the interaction socket between the clients and the server
import { drawFromServer } from './draw.js';
const socket = io();
export function sendDrawToServer(lineInfo) {
    console.log("sending to server: ", lineInfo);
    socket.emit('draw_line', {
        points: lineInfo.points,
        color: lineInfo.color,
        isNewPath: lineInfo.isNewPath
    });
}
socket.on('draw_line', (data) => {
    drawFromServer(data.points, data.color, data.isNewPath);
});
socket.on('message', (msg) => {
    const li = document.createElement("li");
    li.innerHTML = msg;
    document.getElementById("messages")?.appendChild(li);
});
socket.on("connect", () => {
    console.log("connected");
    const statusElement = document.getElementById("connection_status");
    statusElement?.classList.add("good");
    statusElement?.classList.remove("bad");
    if (statusElement)
        statusElement.innerHTML = "Connected";
    joinGroup();
});
socket.on("disconnect", () => {
    console.log("disconnected");
    const statusElement = document.getElementById("connection_status");
    statusElement?.classList.add("bad");
    statusElement?.classList.remove("good");
    if (statusElement)
        statusElement.innerHTML = "Disconnected";
});
export function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value;
    socket.send(message);
    input.value = '';
}
export function sendHello() {
    socket.emit("hello");
}
export function test() {
    console.log("TESTING THINGS");
}
function joinGroup() {
    console.log("joining group");
    socket.emit("join_group");
}
