export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export type ToolType = 'brush' | 'eraser' | 'fill' | 'picker' | 'line' | 'rectangle';

export interface CanvasState {
  pixels: Pixel[][];
  currentColor: string;
  backgroundColor: string;
  gridSize: number;
  pixelSize: number;
  tool: ToolType;
  history: Pixel[][][];
  historyIndex: number;
}

export interface Project {
  id: string;
  name: string;
  canvas: Pixel[][];
  createdAt: Date;
  width: number;
  height: number;
  metadata?: {
    colorsUsed: number;
    lastModified?: Date;
    thumbnail?: string;
  };
}