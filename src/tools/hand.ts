import { IRect, Shape } from "../types";
import { getContext2d } from "../utils/canvas";
import logger from "../utils/logger";
import Records, { IRecord } from "../utils/records";

const BORDER_OFFSET = 5;
let selectedRecord: IRecord | null = null; // 选中的记录

function drawBorder(record: IRecord) {
  const ctx = getContext2d();
  selectedRecord = record;
  if (record.type === Shape.Rect) {
    const { x, y, width, height } = record.data as IRect;
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      x - BORDER_OFFSET,
      y - BORDER_OFFSET,
      width + 2 * BORDER_OFFSET,
      height + 2 * BORDER_OFFSET
    );
    ctx.restore();
  }
}

function onMouseMove(e: MouseEvent) {
  const { movementX, movementY } = e;
  if (!selectedRecord) return;

  selectedRecord.data = {
    ...selectedRecord.data,
    x: (selectedRecord.data as IRect).x + movementX,
    y: (selectedRecord.data as IRect).y + movementY,
  };

  Records.changeRecordById(selectedRecord.id, {
    data: selectedRecord.data,
  });
  Records.repaint();
  drawBorder(selectedRecord);
}

/** 抓取工具 */
export default function handTool(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
) {
  const { clientX, clientY } = e;
  const record = Records.getPointRecord(clientX, clientY);
  logger(`Hand tool: ${JSON.stringify(record)}`);

  if (record) {
    Records.repaint();
    drawBorder(record);
    canvas.addEventListener("mousemove", onMouseMove);

    const mouseUpListener = () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", mouseUpListener);
    };
    canvas.addEventListener("mouseup", mouseUpListener);
  } else {
    // 清除选中，重绘清除边框
    selectedRecord = null;
    Records.repaint(canvas);
  }
}
