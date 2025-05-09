// 5/8/2025
// Controls the interaction socket between the clients and the server
import { updateDraw } from "./draw";
const socket = io();

socket.on("draw_line", function(response) { // 
    updateDraw(response);
});

export function sendDrawToServer(pos) { // send a draw to server
    socket.emit("draw_line", pos);
}

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
    socket.send(message);  // Emits 'message' event
    input.value = '';
}
function sendHello(){
    socket.emit("hello"); 
}