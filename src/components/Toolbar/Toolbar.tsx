import React from 'react';
import styled from 'styled-components';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ToolType, Pixel } from '../types/index';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 576px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  
  @media (min-width: 768px) {
    gap: 15px;
    padding: 20px;
  }
`;

const ToolGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  
  @media (min-width: 576px) {
    &:not(:last-child)::after {
      content: '';
      height: 24px;
      width: 1px;
      background: #e0e0e0;
      margin-left: 8px;
    }
  }
`;

const ToolButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.active ? '#4f46e5' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#4f46e5' : '#ddd'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 10px 15px;
    gap: 8px;
  }
`;

const ColorPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${props => props.color};
  border: 2px solid #ddd;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const ColorInput = styled.input`
  width: 32px;
  height: 32px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 0;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: 2px solid #ddd;
    border-radius: 4px;
  }
`;

const GridSizeSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  min-width: 100px;
  
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 9px 14px;
  }
`;

export const Toolbar: React.FC = () => {
  const tool = useCanvasStore((state) => state.tool);
  const currentColor = useCanvasStore((state) => state.currentColor);
  const gridSize = useCanvasStore((state) => state.gridSize);
  const historyIndex = useCanvasStore((state) => state.historyIndex);
  const history = useCanvasStore((state) => state.history);
  const setTool = useCanvasStore((state) => state.setTool);
  const setCurrentColor = useCanvasStore((state) => state.setCurrentColor);
  const setGridSize = useCanvasStore((state) => state.setGridSize);
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const fillCanvas = useCanvasStore((state) => state.fillCanvas);
  const saveToLocalStorage = useCanvasStore((state) => state.saveToLocalStorage);
  const loadFromLocalStorage = useCanvasStore((state) => state.loadFromLocalStorage);

  const tools: { id: ToolType; label: string; icon: string }[] = [
    { id: 'brush', label: 'Кисть', icon: '🖌️' },
    { id: 'eraser', label: 'Ластик', icon: '🧹' },
    { id: 'fill', label: 'Заливка', icon: '🌊' },
  ];

  const gridSizes = [8, 16, 24, 32, 48, 64];

  const handleExport = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const state = useCanvasStore.getState();
    const pixels = state.pixels;
    const pixelSize = state.pixelSize;
    
    if (!ctx || !pixels.length) return;
    
    canvas.width = pixels[0].length * pixelSize;
    canvas.height = pixels.length * pixelSize;
    
    pixels.forEach((row: Pixel[], y: number) => {
      row.forEach((pixel: Pixel, x: number) => {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      });
    });
    
    const link = document.createElement('a');
    link.download = `pixel-art-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <ToolbarContainer>
      {/* Инструменты рисования */}
      <ToolGroup>
        {tools.map(({ id, label, icon }) => (
          <ToolButton
            key={id}
            active={tool === id}
            onClick={() => setTool(id)}
          >
            {icon} {label}
          </ToolButton>
        ))}
      </ToolGroup>

      {/* Выбор цвета */}
      <ToolGroup>
        <ColorPickerWrapper>
          <ColorPreview color={currentColor} />
          <ColorInput
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            title="Выберите цвет"
          />
          <span style={{ color: '#666', fontSize: '18px' }}>🎨</span>
        </ColorPickerWrapper>
      </ToolGroup>

      {/* История действий */}
      <ToolGroup>
        <ToolButton onClick={undo} disabled={historyIndex === 0}>
          ↩️ Отменить
        </ToolButton>
        <ToolButton onClick={redo} disabled={historyIndex === history.length - 1}>
          ↪️ Вернуть
        </ToolButton>
      </ToolGroup>

      {/* Очистка и заливка */}
      <ToolGroup>
        <ToolButton onClick={clearCanvas}>
          🗑️ Очистить
        </ToolButton>
        <ToolButton onClick={fillCanvas}>
          🌊 Залить
        </ToolButton>
      </ToolGroup>

      {/* Размер сетки */}
      <ToolGroup>
        <span style={{ fontSize: '13px', color: '#666', whiteSpace: 'nowrap' }}>Сетка:</span>
        <GridSizeSelect
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
        >
          {gridSizes.map(size => (
            <option key={size} value={size}>
              {size} × {size}
            </option>
          ))}
        </GridSizeSelect>
      </ToolGroup>

      {/* Сохранение/загрузка/экспорт */}
      <ToolGroup>
        <ToolButton onClick={saveToLocalStorage}>
          💾 Сохр.
        </ToolButton>
        <ToolButton onClick={loadFromLocalStorage}>
          📂 Загр.
        </ToolButton>
        <ToolButton onClick={handleExport}>
          📤 Экспорт
        </ToolButton>
      </ToolGroup>
    </ToolbarContainer>
  );
};