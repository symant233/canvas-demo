import { IRect, Shape } from "../types";
import Records, { IRecord } from "./Records";

export function getCanvas(): HTMLCanvasElement {
  return document.querySelector("canvas")!;
}

export function getContext2d(): CanvasRenderingContext2D {
  return getCanvas().getContext("2d")!;
}

export function drawChildrenLines(record: IRecord) {
  const ctx = getContext2d();
  if (!record.children) return;
  switch (record.type) {
    case Shape.Rect: {
      const { x, y, width, height } = record.data as IRect;
      const parentCenter = {
        x: x + width / 2,
        y: y + height / 2,
      };
      for (const childId of record.children) {
        const child = Records.getRecordById(childId);
        if (!child) continue;
        const { x: cx, y: cy, width: cw, height: ch } = child.data as IRect;
        const childCenter = {
          x: cx + cw / 2,
          y: cy + ch / 2,
        };
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(parentCenter.x, parentCenter.y);
        ctx.lineTo(childCenter.x, childCenter.y);
        ctx.stroke();
      }
      break;
    }
    default:
      break;
  }
}
