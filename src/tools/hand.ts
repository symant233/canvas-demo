import { IRect, Shape } from "../types";
import { getContext2d } from "../utils/canvas";
import logger from "../utils/logger";
import Records, { IRecord } from "../utils/Records";

const BORDER_OFFSET = 5;
let selectedRecord: IRecord | null = null; // 选中的记录
let mouseDownOffset: { x: number; y: number } | null = null; // 鼠标按下时的偏移

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

function _handleMoveChildren(
  record: IRecord,
  offsetX: number,
  offsetY: number
) {
  if (!record.children) return;
  for (const id of record.children) {
    const child = Records.getRecordById(id);
    if (!child) continue;
    child.data = {
      ...child.data,
      x: (child.data as IRect).x + offsetX,
      y: (child.data as IRect).y + offsetY,
    };
    Records.changeRecordById(id, { data: child.data });
    _handleMoveChildren(child, offsetX, offsetY);
  }
}

function onMouseMove(e: MouseEvent) {
  const { clientX, clientY } = e;
  if (!selectedRecord || !mouseDownOffset) return;

  const targetPoint = {
    x: clientX - mouseDownOffset.x,
    y: clientY - mouseDownOffset.y,
  };
  const movement = {
    x: targetPoint.x - (selectedRecord.data as IRect).x,
    y: targetPoint.y - (selectedRecord.data as IRect).y,
  };

  selectedRecord.data = {
    ...selectedRecord.data,
    x: targetPoint.x,
    y: targetPoint.y,
  };

  Records.changeRecordById(selectedRecord.id, {
    data: selectedRecord.data,
  });
  // 移动子元素
  _handleMoveChildren(selectedRecord, movement.x, movement.y);
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
    switch (record.type) {
      case Shape.Rect: {
        mouseDownOffset = {
          x: clientX - (record.data as IRect).x,
          y: clientY - (record.data as IRect).y,
        };
        Records.repaint();
        drawBorder(record);
        canvas.addEventListener("mousemove", onMouseMove);

        const mouseUpListener = () => {
          canvas.removeEventListener("mousemove", onMouseMove);
          canvas.removeEventListener("mouseup", mouseUpListener);
        };
        canvas.addEventListener("mouseup", mouseUpListener);
        break;
      }
      default:
        return;
    }
  } else if (selectedRecord) {
    // 清除选中，重绘清除边框
    selectedRecord = null;
    Records.repaint(canvas);
  }
}
