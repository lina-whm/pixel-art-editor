import React from 'react';
import styled from 'styled-components';

const PaletteContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColorSwatch = styled.button<{ color: string }>`
  width: 30px;
  height: 30px;
  border: 2px solid ${props => props.color === '#ffffff' ? '#ddd' : 'transparent'};
  background-color: ${props => props.color};
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const PRESET_COLORS = [
  // Основные цвета
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF',
  
  // Оттенки серого
  '#333333', '#666666', '#999999', '#CCCCCC',
  
  // Пастельные
  '#FFB6C1', '#FFD700', '#98FB98', '#87CEEB', '#DDA0DD',
  
  // Яркие
  '#FF4500', '#32CD32', '#1E90FF', '#FF1493', '#FFD700'
];

interface ColorPaletteProps {
  onSelectColor: (color: string) => void;
  currentColor: string;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  onSelectColor, 
  currentColor 
}) => {
  return (
    <PaletteContainer>
      {PRESET_COLORS.map((color, index) => (
        <ColorSwatch
          key={index}
          color={color}
          onClick={() => onSelectColor(color)}
          title={color}
          style={{
            border: currentColor === color ? '3px solid #333' : undefined
          }}
        />
      ))}
    </PaletteContainer>
  );
};