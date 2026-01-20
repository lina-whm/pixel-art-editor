import React, { useState } from 'react';
import styled from 'styled-components';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ToolType } from './../types';

const ToolsPanelContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const ToolIcon = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: ${props => props.active ? '#4f46e5' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#4f46e5' : '#e0e0e0'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: ${props => props.active ? '#4338ca' : '#e8e8e8'};
  }
  
  span:first-child {
    font-size: 20px;
    margin-bottom: 6px;
  }
  
  span:last-child {
    font-size: 11px;
    font-weight: 500;
  }
`;

const ToolSettings = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  
  label {
    font-size: 14px;
    color: #666;
  }
`;

const RangeInput = styled.input`
  width: 150px;
`;

export const ToolsPanel: React.FC = () => {
  const tool = useCanvasStore((state) => state.tool);
  const pixelSize = useCanvasStore((state) => state.pixelSize);
  const setTool = useCanvasStore((state) => state.setTool);
  const setPixelSize = useCanvasStore((state) => state.setPixelSize);
  
  const [brushSize, setBrushSize] = useState(1);

  const tools: { id: ToolType; label: string; icon: string }[] = [
    { id: 'brush', label: 'Кисть', icon: '🖌️' },
    { id: 'eraser', label: 'Ластик', icon: '🧹' },
    { id: 'picker', label: 'Пипетка', icon: '🎯' },
    { id: 'line', label: 'Линия', icon: '📏' },
    { id: 'rectangle', label: 'Прямоугольник', icon: '⬜' },
    { id: 'fill', label: 'Заливка', icon: '🌊' },
  ];

  return (
    <ToolsPanelContainer>
      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Инструменты</h3>
      
      <ToolsGrid>
        {tools.map(({ id, label, icon }) => (
          <ToolIcon
            key={id}
            active={tool === id}
            onClick={() => setTool(id)}
            title={label}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </ToolIcon>
        ))}
      </ToolsGrid>

      <ToolSettings>
        <SettingRow>
          <label>Размер кисти:</label>
          <div>
            {[1, 2, 3, 4].map(size => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                style={{
                  margin: '0 2px',
                  padding: '4px 8px',
                  background: brushSize === size ? '#4f46e5' : '#f0f0f0',
                  color: brushSize === size ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </SettingRow>
        
        <SettingRow>
          <label>Размер пикселя:</label>
          <RangeInput
            type="range"
            min="8"
            max="32"
            step="2"
            value={pixelSize}
            onChange={(e) => setPixelSize(Number(e.target.value))}
          />
          <span style={{ fontSize: '12px', color: '#666', width: '30px' }}>{pixelSize}px</span>
        </SettingRow>
      </ToolSettings>
    </ToolsPanelContainer>
  );
};