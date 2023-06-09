const socketMain = (io) => {
  io.on("connection", (socket) => {
    const auth = socket.handshake.auth
    if (auth.token === '123') {
      socket.join('nodeClient')
    } else if (auth.token === '456') {
      socket.join('reactClient')
    } else {
      socket.disconnect()
      console.log('Invalid token')
    }
    console.log(`Worker ${process.pid} received connection`);
    
    socket.emit("hello", "world");
    
    socket.on("perfData", (data) => {
      io.to('reactClient').emit('perfData', data)
    })
    
    socket.on("disconnect", () => {
      io.to('reactClient').emit('connectedOrNot', {isAlive: false})
    });
  });
}

module.exports = socketMain;