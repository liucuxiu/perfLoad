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
  
  return (
    <>
      <Widget/>
    </>
  
  );
}

export default App;
