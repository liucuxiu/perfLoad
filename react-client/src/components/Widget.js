import Cpu from "./Cpu";
import Info from "./Info";
import Mem from "./Mem";

const Widget = () => {
  return (
    <div>
      <h1>Widget</h1>
      <Cpu/>
      <Mem/>
      <Info/>
    </div>
  )
}

export default Widget;