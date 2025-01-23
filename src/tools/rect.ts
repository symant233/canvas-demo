import { IRect, Shape } from "../types";
import Records, { IRecord } from "../utils/records";

let rectangle: IRecord | null = null;

function handleMouseMove(e: MouseEvent) {
  if (!rectangle) return;
  const { clientX, clientY } = e;
  const data = rectangle.data as IRect;
  (rectangle.data as IRect).width = clientX - data.x;
  (rectangle.data as IRect).height = clientY - data.y;

  Records.changeRecordById(rectangle.id, {
    data: rectangle.data,
  });
  Records.repaint();
}

/** 绘制矩形工具 */
export default function rectTool(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
) {
  const { clientX, clientY } = e; // 起点
  const fillStyle = "rgba(255, 255, 0, 0.3)";

  rectangle = Records.addRecord({
    type: Shape.Rect,
    data: {
      x: clientX,
      y: clientY,
      width: 1,
      height: 1,
    },
    fillStyle,
  });
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(clientX, clientY, 1, 1);
  ctx.restore();

  canvas.addEventListener("mousemove", handleMouseMove);
  const mouseUpListener = () => {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", mouseUpListener);
  };
  canvas.addEventListener("mouseup", mouseUpListener);
}
