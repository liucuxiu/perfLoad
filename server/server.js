const cluster = require("cluster");// make it so we can use multiple threads
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky"); // make it so that can find its way back to the correct worker
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter"); //make it so that primary process can communicate with the workers

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  
  const httpServer = http.createServer();
  
  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });
  
  // setup connections between the workers
  setupPrimary();
  
  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js > 16.0.0
  cluster.setupPrimary({
    serialization: "advanced",
  });
  
  httpServer.listen(3000); //internet facing port
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);
  
  const httpServer = http.createServer();
  const io = new Server(httpServer);
  
  // use the cluster adapter
  io.adapter(createAdapter());
  
  // setup connection with the primary process
  setupWorker(io);
  
  io.on("connection", (socket) => {
    console.log(`Worker ${process.pid} received connection`);
    socket.emit("hello", "world");
  });
}