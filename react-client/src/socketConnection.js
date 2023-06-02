import io from "socket.io-client";
const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on('hello', (data) => {
  console.log(data)
})