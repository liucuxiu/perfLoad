import './App.css';
import socket from "./socketConnection";
import {useEffect, useState} from "react";
import Widget from "./components/Widget";

function App() {
  const [perfData, setPerfData] = useState({})
  
  useEffect(() => {
    socket.on('perfData', (data) => {
      const copy = {...perfData};
      copy[data.macA] = data;
      setPerfData(copy)
    })
  }, [])
  
  const widgets = Object.values(perfData).map((d) => {
    return <Widget key={d.macA} data={d}/>
  })
  
  return (
    <>
      {widgets}
    </>
  
  );
}

export default App;
