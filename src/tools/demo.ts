import { Shape } from "../types";
import Records from "../utils/Records";

/** Canvas 初始化 demo 绘制 */
export default function demo(cv: HTMLCanvasElement) {
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  const fillStyle = "rgba(105, 188, 209, 0.5)";
  const rectangle = { x: 100, y: 200, width: 100, height: 100 };
  const fillStyle2 = "rgba(124, 209, 105, 0.5)";
  const rectangle2 = { x: 150, y: 280, width: 200, height: 50 };
  const strokeStyle = "rgba(187, 105, 209, 0.5)";
  const rectangle3 = { x: 500, y: 100, width: 50, height: 50 };

  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  ctx.fillStyle = fillStyle2;
  ctx.fillRect(rectangle2.x, rectangle2.y, rectangle2.width, rectangle2.height);
  ctx.strokeStyle = strokeStyle;
  ctx.strokeRect(
    rectangle3.x,
    rectangle3.y,
    rectangle3.width,
    rectangle3.height
  );
  ctx.restore();

  const r1 = Records.addRecord({
    type: Shape.Rect,
    data: rectangle,
    fillStyle,
  });
  const r2 = Records.addRecord({
    type: Shape.Rect,
    data: rectangle2,
    fillStyle: fillStyle2,
    children: [r1.id],
  });
  Records.addRecord({
    type: Shape.Rect,
    data: rectangle3,
    strokeStyle,
    children: [r2.id],
  });
}
