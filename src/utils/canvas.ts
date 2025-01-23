export function getCanvas(): HTMLCanvasElement {
  return document.querySelector("canvas")!;
}

export function getContext2d(): CanvasRenderingContext2D {
  return getCanvas().getContext("2d")!;
}
