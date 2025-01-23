/** 工具类型 */
export enum TOOLS {
  HAND = "Hand",
  RECT = "Rect",
}

/** 矩形 */
export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 圆 */
export interface ICircle {
  x: number;
  y: number;
  radius: number;
}

export interface ILine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type IShapeData = {
  [Shape.Rect]: IRect;
  [Shape.Circle]: ICircle;
  [Shape.Line]: ILine;
};

/** 图形枚举 */
export enum Shape {
  Rect = "rect",
  Circle = "circle",
  Line = "line",
}
