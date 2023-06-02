const socketMain = (io) => {
  io.on("connection", (socket) => {
    console.log(`Worker ${process.pid} received connection`);
    socket.emit("hello", "world");
  });
}

module.exports = socketMain;