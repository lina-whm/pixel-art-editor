import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useCanvasStore } from '../../store/useCanvasStore';

const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: auto;
  max-width: 100%;
  min-height: 300px;
  
  @media (min-width: 576px) {
    padding: 15px;
    border-radius: 10px;
  }
  
  @media (min-width: 768px) {
    padding: 20px;
    border-radius: 12px;
    min-height: 400px;
  }
`;

const CanvasGrid = styled.div<{ gridSize: number; pixelSize: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.gridSize}, ${props => props.pixelSize}px);
  grid-template-rows: repeat(${props => props.gridSize}, ${props => props.pixelSize}px);
  gap: 1px;
  background: #ddd;
  border: 1px solid #333;
  cursor: crosshair;
  user-select: none;
  
  @media (min-width: 768px) {
    border-width: 2px;
  }
`;

const PixelElement = styled.div<{ color: string; pixelSize: number }>`
  width: ${props => props.pixelSize}px;
  height: ${props => props.pixelSize}px;
  background-color: ${props => props.color};
  transition: background-color 0.1s;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

export const PixelCanvas: React.FC = () => {
  const pixels = useCanvasStore((state) => state.pixels);
  const pixelSize = useCanvasStore((state) => state.pixelSize);
  const gridSize = useCanvasStore((state) => state.gridSize);
  const tool = useCanvasStore((state) => state.tool);
  const setPixel = useCanvasStore((state) => state.setPixel);
  const floodFill = useCanvasStore((state) => state.floodFill);

  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePixelClick = (x: number, y: number) => {
    if (tool === 'fill') {
      floodFill(x, y);
    } else {
      setPixel(x, y);
    }
  };

  const handleMouseDown = (x: number, y: number) => {
    setIsDrawing(true);
    if (tool === 'fill') {
      floodFill(x, y);
    } else {
      setPixel(x, y);
    }
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDrawing && tool !== 'fill') {
      setPixel(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Функция для отображения сетки пикселей
  const renderPixels = () => {
    const result = [];
    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        const pixel = pixels[y][x];
        result.push(
          <PixelElement
            key={`${pixel.x}-${pixel.y}`}
            color={pixel.color}
            pixelSize={pixelSize}
            onClick={() => handlePixelClick(pixel.x, pixel.y)}
            onMouseDown={() => handleMouseDown(pixel.x, pixel.y)}
            onMouseEnter={() => handleMouseEnter(pixel.x, pixel.y)}
            title={`${pixel.x}, ${pixel.y}`}
          />
        );
      }
    }
    return result;
  };

  return (
    <CanvasContainer>
      <CanvasGrid
        ref={canvasRef}
        gridSize={gridSize}
        pixelSize={pixelSize}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {renderPixels()}
      </CanvasGrid>
    </CanvasContainer>
  );
};