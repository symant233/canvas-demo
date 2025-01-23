import { useRef, useState } from "react";
import { TOOLS } from "./types";
import useWindowResize from "./hooks/useWindowResize";

export default function App() {
  const [tool, setTool] = useState<TOOLS>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleToolSelect = (tool: TOOLS) => {
    setTool(tool);
  };

  const handleCanvasResize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  useWindowResize(handleCanvasResize);

  return (
    <>
      <div className="canvas-tools">
        {Object.values(TOOLS).map((value) => (
          <div
            className={["tool", tool === value && "active"].join(" ")}
            key={value}
            onClick={handleToolSelect.bind(null, value)}
          >
            {value}
          </div>
        ))}
      </div>

      <canvas id="canvas" ref={canvasRef}></canvas>
    </>
  );
}
