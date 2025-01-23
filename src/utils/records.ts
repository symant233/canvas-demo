import { Shape, IShapeData, IRect } from "../types";
import { getCanvas } from "./canvas";
import generateRandomId from "./id";
import logger from "./logger";

export type IRecord = {
  id: string;
  type: Shape;
  data: IShapeData[Shape];
  fillStyle?: string;
  strokeStyle?: string;
};

/** Canvas 管理图形位置等信息的记录 */
class Records {
  private records: IRecord[] = [];

  /** 添加记录 */
  addRecord(record: Omit<IRecord, "id">) {
    const _record = { ...record, id: generateRandomId() };
    this.records.unshift(_record);
    logger(`Add record: ${JSON.stringify(record)}`);
    return _record;
  }

  /** 清空记录 */
  clearRecords() {
    this.records = [];
    logger("Clear records");
  }

  /** 通过 id 获取记录 */
  getRecordById(id: string) {
    return this.records.find((record) => record.id === id);
  }

  /** 获取记录 */
  getRecords() {
    return this.records;
  }

  changeRecordById(id: string, record: Partial<IRecord>) {
    const index = this.records.findIndex((record) => record.id === id);
    if (index === -1) return;
    this.records[index] = { ...this.records[index], ...record };
    logger(`Change record: ${JSON.stringify(record)}`);
  }

  /** 获取指定坐标的首个记录 */
  getPointRecord(clientX: number, clientY: number) {
    for (const record of this.records) {
      if (record.type === Shape.Rect) {
        const { x, y, width, height } = record.data as IRect;
        if (
          clientX > x &&
          clientX < x + width &&
          clientY > y &&
          clientY < y + height
        ) {
          return record;
        }
      }
    }
    return null;
  }

  repaint(canvas?: HTMLCanvasElement) {
    if (!canvas) {
      canvas = getCanvas();
    }
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 倒序重绘
    for (let index = this.records.length - 1; index >= 0; index--) {
      const record = this.records[index];
      switch (record.type) {
        case Shape.Rect: {
          const { x, y, width, height } = record.data as IRect;
          ctx.save();
          if (record.fillStyle) {
            ctx.fillStyle = record.fillStyle;
            ctx.fillRect(x, y, width, height);
          } else if (record.strokeStyle) {
            ctx.strokeStyle = record.strokeStyle;
            ctx.strokeRect(x, y, width, height);
          } else {
            ctx.fillRect(x, y, width, height);
          }
          ctx.restore();
          break;
        }
        default:
          break;
      }
    }
    logger("Repaint records");
  }
}

export default new Records();
