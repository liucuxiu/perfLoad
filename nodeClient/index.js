// the node program that captures local performance data
// and sends it up to the socket.io server
// Req:
// - farmhash
// - socket.io-client

// what do we want to know from node about performance?
// - CPU load (current)
// - Memory Useage
// - OS type
// - uptime
// - CPU info

const os = require('os');
const osType = os.type() === 'Darwin' ? 'Mac' : os.type();

const upTime = os.uptime();

const freeMem = os.freemem(); //in bytes

const totalMem = os.totalmem(); //in bytes

const usedMem = totalMem - freeMem;
const memUsage = Math.floor(usedMem / totalMem * 100) / 100;

//cpu type
const cpuModel = os.cpus()[0].model;

//nums of cores
const numCores = os.cpus().length;

//cpu load
const cpuLoad = os.loadavg()[2];

//clock speed
const cpuSpeed = os.cpus()[0].speed;
console.log(cpuSpeed, cpuModel, numCores, cpuLoad, memUsage, totalMem, freeMem, upTime, osType);