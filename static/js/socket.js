// 5/8/2025
// Controls the interaction socket between the clients and the server

const socket = io();

import { drawFromServer } from "./draw.js"

export function sendDrawToServer(lineInfo){
    console.log("sending to server: " + lineInfo)
    socket.emit('draw_line', lineInfo);
}
socket.on('draw_line', function (data) {
    console.log("recieving from server: " + data)
    drawFromServer(data);
});

socket.on('message', function (msg) {
    console.log('sent message');
    const li = document.createElement("li");
    li.innerHTML = msg;
    document.getElementById("messages").appendChild(li);
});

socket.on("connect", () => {
    console.log("connected");
    document.getElementById("connection_status").innerHTML = "Connected";
});

socket.on("disconnect", () => {
    console.log("disconnected");
    document.getElementById("connection_status").innerHTML = "Disconnected";
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value;
    socket.send(message);  // Emits 'message' event to server
    input.value = '';
}
function sendHello(){
    socket.emit("hello"); 
}

export function test() {
    console.log("TESTING THINGS");
}