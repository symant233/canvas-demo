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
  children?: string[];
  modifiedAt: number;
};

/** Canvas 管理图形位置等信息的记录 */
class Records {
  private recordsMap = new Map<string, IRecord>(); // 记录映射，通过 id 获取记录

  /** 添加记录 */
  addRecord(record: Omit<IRecord, "id" & "modifiedAt">) {
    const _record: IRecord = {
      ...record,
      id: generateRandomId(),
      modifiedAt: Date.now(),
    };
    this.recordsMap.set(_record.id, _record);
    logger(`Add record: ${JSON.stringify(record)}`);
    return _record;
  }

  /** 清空记录 */
  clearRecords() {
    this.recordsMap.clear();
    logger("Clear records");
  }

  /** 通过 id 获取记录 */
  getRecordById(id: string) {
    return this.recordsMap.get(id);
  }

  /** 获取记录，以 */
  getRecordsArray() {
    return Array.from(this.recordsMap.values()).sort(
      (a, b) => b.modifiedAt - a.modifiedAt
    );
  }

  changeRecordById(id: string, record: Partial<IRecord>) {
    const editingRecord = this.getRecordById(id);
    if (!editingRecord) return;
    this.recordsMap.set(id, {
      ...editingRecord,
      ...record,
      modifiedAt: Date.now(),
    });
    logger(`Change record: ${JSON.stringify(record)}`);
  }

  /** 获取指定坐标的首个记录 */
  getPointRecord(clientX: number, clientY: number) {
    for (const record of this.getRecordsArray()) {
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

  /** 重绘所有内容 */
  repaint(canvas?: HTMLCanvasElement) {
    if (!canvas) {
      canvas = getCanvas();
    }
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const records: IRecord[] = this.getRecordsArray();
    // 倒序重绘
    for (let index = records.length - 1; index >= 0; index--) {
      const record = records[index];
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
