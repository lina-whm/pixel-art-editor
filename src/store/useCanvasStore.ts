import { create } from 'zustand';
import { Pixel, ToolType } from '../components/types/index';

interface StoreState {
  // State
  pixels: Pixel[][];
  currentColor: string;
  backgroundColor: string;
  gridSize: number;
  pixelSize: number;
  tool: ToolType;
  history: Pixel[][][];
  historyIndex: number;

  // Actions
  setPixel: (x: number, y: number, color?: string) => void;
  setCurrentColor: (color: string) => void;
  setTool: (tool: ToolType) => void;
  setPixelSize: (size: number) => void;
  setGridSize: (size: number) => void;
  clearCanvas: () => void;
  fillCanvas: () => void;
  undo: () => void;
  redo: () => void;
  initializeCanvas: (width: number, height: number) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  floodFill: (x: number, y: number, newColor?: string) => void;
}

const CANVAS_WIDTH = 32;
const CANVAS_HEIGHT = 32;
const DEFAULT_COLOR = '#000000';
const BACKGROUND_COLOR = '#ffffff';

const createEmptyCanvas = (width: number = CANVAS_WIDTH, height: number = CANVAS_HEIGHT): Pixel[][] => 
  Array(height).fill(null).map((_, y) =>
    Array(width).fill(null).map((_, x) => ({
      x,
      y,
      color: BACKGROUND_COLOR
    }))
  );

export const useCanvasStore = create<StoreState>((set, get) => ({
  // State
  pixels: createEmptyCanvas(),
  currentColor: DEFAULT_COLOR,
  backgroundColor: BACKGROUND_COLOR,
  gridSize: CANVAS_WIDTH,
  pixelSize: 16,
  tool: 'brush',
  history: [createEmptyCanvas()],
  historyIndex: 0,

  // Actions
  initializeCanvas: (width: number, height: number) => {
    const newPixels = createEmptyCanvas(width, height);
    set({
      pixels: newPixels,
      gridSize: width,
      history: [newPixels],
      historyIndex: 0
    });
  },

  setPixel: (x: number, y: number, color?: string) => {
    const state = get();
    const newPixels = state.pixels.map(row => [...row]);
    const actualColor = color || state.currentColor;
    
    if (state.tool === 'eraser') {
      newPixels[y][x] = { x, y, color: state.backgroundColor };
    } else {
      newPixels[y][x] = { x, y, color: actualColor };
    }

    // Сохраняем в историю
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newPixels);
    
    set({
      pixels: newPixels,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  setCurrentColor: (color: string) => {
    set({ currentColor: color });
  },
  
  setTool: (tool: ToolType) => {
    set({ tool });
  },
  
  setPixelSize: (size: number) => {
    set({ pixelSize: size });
  },
  
  setGridSize: (size: number) => {
    const state = get();
    const currentPixels = state.pixels;
    const newPixels = Array(size).fill(null).map((_, y) =>
      Array(size).fill(null).map((_, x) => ({
        x,
        y,
        color: y < currentPixels.length && x < currentPixels[0]?.length 
          ? currentPixels[y][x].color 
          : state.backgroundColor
      }))
    );
    
    set({
      pixels: newPixels,
      gridSize: size,
      history: [newPixels],
      historyIndex: 0
    });
  },

  clearCanvas: () => {
    const state = get();
    const newPixels = createEmptyCanvas(state.gridSize, state.gridSize);
    
    set({
      pixels: newPixels,
      history: [newPixels],
      historyIndex: 0
    });
  },

  fillCanvas: () => {
    const state = get();
    const newPixels = Array(state.gridSize).fill(null).map((_, y) =>
      Array(state.gridSize).fill(null).map((_, x) => ({
        x,
        y,
        color: state.currentColor
      }))
    );
    
    const newHistory = [...state.history, newPixels];
    
    set({
      pixels: newPixels,
      history: newHistory,
      historyIndex: state.historyIndex + 1
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      set({
        pixels: state.history[newIndex],
        historyIndex: newIndex
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      set({
        pixels: state.history[newIndex],
        historyIndex: newIndex
      });
    }
  },

  saveToLocalStorage: () => {
    const state = get();
    localStorage.setItem('pixelArtCanvas', JSON.stringify({
      pixels: state.pixels,
      currentColor: state.currentColor,
      gridSize: state.gridSize
    }));
  },

  loadFromLocalStorage: () => {
    const saved = localStorage.getItem('pixelArtCanvas');
    if (saved) {
      try {
        const { pixels, currentColor, gridSize } = JSON.parse(saved);
        set({
          pixels,
          currentColor,
          gridSize,
          history: [pixels],
          historyIndex: 0
        });
      } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
      }
    }
  },

  floodFill: (x: number, y: number, newColor?: string) => {
    const state = get();
    const targetColor = state.pixels[y][x].color;
    const fillColor = newColor || state.currentColor;
    
    // Если цвет уже такой же, ничего не делаем
    if (targetColor === fillColor) return;
    
    // Создаем глубокую копию пикселей
    const newPixels = state.pixels.map(row => 
      row.map(pixel => ({ ...pixel }))
    );
    
    const queue = [[x, y]];
    const visited = new Set<string>();
    const gridSize = state.gridSize;
    
    while (queue.length > 0) {
      const [currentX, currentY] = queue.shift()!;
      const key = `${currentX},${currentY}`;
      
      // Проверяем границы
      if (
        currentX < 0 || currentX >= gridSize ||
        currentY < 0 || currentY >= gridSize
      ) {
        continue;
      }
      
      // Проверяем, посещали ли уже и подходит ли цвет
      if (visited.has(key) || newPixels[currentY][currentX].color !== targetColor) {
        continue;
      }
      
      // Заливаем пиксель
      newPixels[currentY][currentX].color = fillColor;
      visited.add(key);
      
      // Добавляем соседей (алгоритм заливки с 4-связностью)
      queue.push([currentX + 1, currentY]);
      queue.push([currentX - 1, currentY]);
      queue.push([currentX, currentY + 1]);
      queue.push([currentX, currentY - 1]);
    }
    
    // Сохраняем в историю
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPixels];
    
    set({
      pixels: newPixels,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },
}));