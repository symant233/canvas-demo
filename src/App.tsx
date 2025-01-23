import { useCallback, useEffect, useRef, useState } from "react";
import { TOOLS } from "./types";
import useWindowResize from "./hooks/useWindowResize";
import demo from "./tools/demo";
import Records from "./utils/records";
import logger from "./utils/logger";
import handTool from "./tools/hand";
import rectTool from "./tools/rect";

export default function App() {
  const [tool, setTool] = useState<TOOLS>(TOOLS.HAND);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleToolSelect = useCallback((tool: TOOLS) => {
    setTool(tool);
  }, []);

  const handleCanvasResize = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      Records.repaint(canvasRef.current);
    }
  }, []);

  useWindowResize(handleCanvasResize);

  useEffect(() => {
    if (!canvasRef.current) return;
    demo(canvasRef.current);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    logger(`Mouse down: ${e.clientX}, ${e.clientY}, current tool: ${tool}`);
    if (!canvasRef.current) return;
    switch (tool) {
      case TOOLS.HAND:
        handTool(e, canvasRef.current);
        break;
      case TOOLS.RECT:
        rectTool(e, canvasRef.current);
        break;
      default:
        Records.repaint(canvasRef.current);
        break;
    }
  };

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

      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      <div className="logger"></div>
    </>
  );
}
