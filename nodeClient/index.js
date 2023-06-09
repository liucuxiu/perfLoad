const os = require('os');
const io = require('socket.io-client');

const options = {
  auth: {
    token: '123'
  }
}
const socket = io('http://127.0.0.1:3000', options); //server port

socket.on('connect', () => {
  console.log('NodeClient connected to the socket server... hooray!!!');
  
  const nI = os.networkInterfaces();
  let macA;
  for (let key in nI) {
    const isInternetFacing = !nI[key][0].internal;
    
    if (isInternetFacing) {
      macA = nI[key][0].mac;
      break;
    }
  }
  
  const perfDataInterval = setInterval(async () => {
    const perfData = await performanceData();
    perfData.macA = macA;
    socket.emit('perfData', perfData);
  }, 1000);
  
  socket.on('disconnect', () => {
    clearInterval(perfDataInterval);
  })
})

const performanceData = () => new Promise(async (resolve, reject) => {
  const osType = os.type() === 'Darwin' ? 'Mac' : os.type();
  
  const upTime = os.uptime();
  
  const freeMem = os.freemem(); //in bytes
  
  const totalMem = os.totalmem(); //in bytes
  
  const usedMem = totalMem - freeMem;
  const memUsage = Math.floor(usedMem / totalMem * 100) / 100;
  
  //cpu type
  const cpuType = os.cpus()[0].model;
  
  //nums of cores
  const numCores = os.cpus().length;
  
  //clock speed
  const cpuSpeed = os.cpus()[0].speed;
  
  const cpuLoad = await getCpuLoad();
  
  resolve({
    freeMem,
    totalMem,
    usedMem,
    memUsage,
    osType,
    upTime,
    cpuType,
    numCores,
    cpuSpeed,
    cpuLoad
  })
});

const cpuAverage = () => {
  const cpus = os.cpus();
  
  // cpus is an array of all cores. we need to average all the cores which will give us the cpu average
  let idleMs = 0;
  let totalMs = 0;
  
  cpus.forEach((core) => {
    for (let mode in core.times) {
      totalMs += core.times[mode];
    }
    idleMs += core.times.idle;
  })
  return {
    idleMs: idleMs / cpus.length,
    totalMs: totalMs / cpus.length
  }
}

const getCpuLoad = () => new Promise((resolve, reject) => {
  const start = cpuAverage();
  setTimeout(() => {
    const end = cpuAverage();
    const idleDiff = end.idleMs - start.idleMs;
    const totalDiff = end.totalMs - start.totalMs;
    const percentageCpu = 100 - Math.floor(100 * idleDiff / totalDiff);
    resolve(percentageCpu);
  }, 100)
})


const run = async () => {
  const data = await performanceData();
  console.log(data);
}

run();