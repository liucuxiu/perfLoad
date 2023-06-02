import Cpu from "./Cpu";
import Info from "./Info";
import Mem from "./Mem";
import "./Widget.css"
import {useEffect, useState} from "react";
import socket from "../utilities/socketConnection";

const Widget = ({data}) => {
  const [ isAlive, setIsAlive ] = useState(true);
  
  const {
    freeMem,
    totalMem,
    usedMem,
    memUsage,
    osType,
    upTime,
    cpuType,
    numCores,
    cpuSpeed,
    cpuLoad,
    macA
  } = data
  
  const cpuData = {cpuLoad}
  const memData = {freeMem, totalMem, usedMem, memUsage}
  const infoData = {osType, upTime, macA, cpuType, cpuSpeed, numCores}
  const notAliveDiv = !isAlive ? <div className="not-active">Offline</div> : <></>;
  
  useEffect(()=>{
    socket.on('connectedOrNot',({isAlive, machineMacA})=>{
      // if(machineMacA === macA){
        setIsAlive(isAlive)
      // }
    })
  },[])
  
  return (
    <div className="widget row justify-content-evenly">
      {notAliveDiv}
  
      <h1>Widget</h1>
      <Cpu data={cpuData}/>
      <Mem data={memData}/>
      <Info data={infoData}/>
    </div>
  )
}

export default Widget;