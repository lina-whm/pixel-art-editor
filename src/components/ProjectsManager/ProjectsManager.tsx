import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Project, Pixel } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

const ProjectsContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 0;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
  
  @media (min-width: 992px) {
    margin-top: 20px;
  }
`;

const ProjectsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  
  @media (min-width: 576px) {
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }
`;

const Title = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  
  @media (min-width: 576px) {
    width: auto;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.variant === 'primary' ? '#4f46e5' : '#f0f0f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  flex: 1;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: ${props => props.variant === 'primary' ? '#4338ca' : '#e0e0e0'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (min-width: 576px) {
    flex: none;
    font-size: 14px;
    padding: 8px 16px;
    gap: 8px;
  }
`;

const ProjectCard = styled.div<{ isCurrent?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 2px solid ${props => props.isCurrent ? '#4f46e5' : '#eee'};
  background: ${props => props.isCurrent ? '#f5f3ff' : 'white'};
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.isCurrent ? '#f5f3ff' : '#f9f9f9'};
    border-color: ${props => props.isCurrent ? '#4f46e5' : '#ddd'};
    transform: translateY(-2px);
  }
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 12px 15px;
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  
  @media (min-width: 576px) {
    align-items: center;
  }
`;

const ProjectIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
`;

const ProjectDetails = styled.div`
  flex: 1;
  min-width: 0; /* Для корректного обрезания текста */
`;

const ProjectName = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  
  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const ProjectNameText = styled.span<{ isEditing?: boolean }>`
  font-weight: 600;
  color: #333;
  font-size: 14px;
  background: ${props => props.isEditing ? '#fff' : 'transparent'};
  padding: ${props => props.isEditing ? '4px 8px' : '0'};
  border: ${props => props.isEditing ? '1px solid #ddd' : 'none'};
  border-radius: ${props => props.isEditing ? '4px' : '0'};
  word-break: break-word;
  
  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const ProjectNameInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  font-family: inherit;
  
  @media (min-width: 576px) {
    width: 200px;
  }
`;

const ProjectMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 11px;
  color: #666;
  
  @media (min-width: 768px) {
    font-size: 12px;
    gap: 15px;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  
  @media (min-width: 768px) {
    gap: 8px;
    justify-content: flex-start;
  }
`;

const IconButton = styled.button<{ color?: string }>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  color: ${props => props.color || '#666'};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.color || '#4f46e5'};
    color: white;
    transform: scale(1.1);
  }
  
  @media (min-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 15px;
  color: #666;
  
  @media (min-width: 768px) {
    padding: 40px 20px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
  color: #ddd;
  
  @media (min-width: 768px) {
    font-size: 48px;
    margin-bottom: 15px;
  }
`;

const ProjectsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

const ProjectsFooter = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-size: 11px;
  color: #666;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const EditButtons = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
  
  @media (min-width: 576px) {
    margin-top: 0;
  }
`;

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PROJECTS_STORAGE_KEY = 'pixelArtProjects_v1';

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      return [];
    }
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const pixels = useCanvasStore((state) => state.pixels);
  const gridSize = useCanvasStore((state) => state.gridSize);
  const initializeCanvas = useCanvasStore((state) => state.initializeCanvas);

  // Загружаем проекты при монтировании
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsedProjects = JSON.parse(saved);
        const projectsWithDates = parsedProjects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt)
        }));
        setProjects(projectsWithDates);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  }, []);

  // Сохраняем проекты при изменении
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Ошибка сохранения проектов:', error);
    }
  }, [projects]);

  const saveProject = () => {
    try {
      const newProject: Project = {
        id: uuidv4(),
        name: `Проект ${projects.length + 1}`,
        canvas: JSON.parse(JSON.stringify(pixels)),
        createdAt: new Date(),
        width: pixels[0]?.length || gridSize,
        height: pixels.length || gridSize
      };
      
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      
      return newProject;
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
      return null;
    }
  };

  const loadProject = (project: Project) => {
    try {
      const currentPixels = pixels;
      
      // Восстанавливаем канвас
      initializeCanvas(project.width, project.height);
      
      // Обновляем пиксели
      setTimeout(() => {
        useCanvasStore.setState((state) => ({
          ...state,
          pixels: project.canvas,
          gridSize: project.width,
          history: [project.canvas],
          historyIndex: 0
        }));
      }, 0);
      
      // Проверяем, не пустой ли текущий проект
      const isEmpty = currentPixels.every((row: Pixel[]) => 
        row.every((pixel: Pixel) => pixel.color === '#ffffff')
      );
      
      if (!isEmpty) {
        const currentProject: Project = {
          id: uuidv4(),
          name: `Автосохранение ${new Date().toLocaleTimeString()}`,
          canvas: currentPixels,
          createdAt: new Date(),
          width: currentPixels[0]?.length || gridSize,
          height: currentPixels.length || gridSize
        };
        
        setProjects(prev => [currentProject, ...prev].slice(0, 50));
      }
      
      alert(`Проект "${project.name}" загружен!`);
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
      alert('Не удалось загрузить проект');
    }
  };

  const deleteProject = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
    }
  };

  const startEditing = (project: Project, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setEditingId(project.id);
    setEditName(project.name);
  };

  const saveEdit = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (editName.trim()) {
      const updatedProjects = projects.map(p => 
        p.id === id ? { ...p, name: editName.trim() } : p
      );
      setProjects(updatedProjects);
    }
    
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setEditingId(null);
    setEditName('');
  };

  const exportProject = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const projectData = {
        ...project,
        exportedAt: new Date().toISOString(),
        appVersion: '1.0.0'
      };
      
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const link = document.createElement('a');
      link.setAttribute('href', dataUri);
      link.setAttribute('download', `pixelart-${project.name.replace(/\s+/g, '-').toLowerCase()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Проект "${project.name}" экспортирован!`);
    } catch (error) {
      console.error('Ошибка экспорта проекта:', error);
      alert('Не удалось экспортировать проект');
    }
  };

  const importProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedProject = JSON.parse(content);
        
        if (!importedProject.canvas || !Array.isArray(importedProject.canvas)) {
          throw new Error('Неверный формат файла');
        }
        
        const projectToImport: Project = {
          id: uuidv4(),
          name: importedProject.name || `Импортированный проект`,
          canvas: importedProject.canvas,
          createdAt: new Date(),
          width: importedProject.width || importedProject.canvas[0]?.length || 32,
          height: importedProject.height || importedProject.canvas.length || 32
        };
        
        const updatedProjects = [...projects, projectToImport];
        setProjects(updatedProjects);
        
        event.target.value = '';
        
        alert(`Проект "${projectToImport.name}" успешно импортирован!`);
      } catch (error) {
        console.error('Ошибка импорта проекта:', error);
        alert('Не удалось импортировать проект. Проверьте формат файла.');
      }
    };
    
    reader.readAsText(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent, projectId: string) => {
    if (e.key === 'Enter') {
      saveEdit(projectId);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const countUniqueColors = (canvas: Pixel[][]): number => {
    const colorSet = new Set<string>();
    canvas.forEach((row: Pixel[]) => {
      row.forEach((pixel: Pixel) => {
        colorSet.add(pixel.color);
      });
    });
    return colorSet.size;
  };

  return (
    <ProjectsContainer>
      <ProjectsHeader>
        <Title>📁 Мои проекты ({projects.length})</Title>
        <ActionButtons>
          <ActionButton variant="primary" onClick={saveProject}>
            📁 Сохранить текущий
          </ActionButton>
          <ActionButton as="label">
            <input
              type="file"
              accept=".json"
              onChange={importProject}
              style={{ display: 'none' }}
            />
            📥 Импорт
          </ActionButton>
        </ActionButtons>
      </ProjectsHeader>
      
      {projects.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📁</EmptyIcon>
          <p>Нет сохраненных проектов</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Создайте рисунок и нажмите "Сохранить текущий"
          </p>
        </EmptyState>
      ) : (
        <ProjectsList>
          {projects
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((project: Project) => (
              <ProjectCard
                key={project.id}
                onClick={() => loadProject(project)}
                title="Нажмите для загрузки"
              >
                <ProjectInfo>
                  <ProjectIcon>
                    📁
                  </ProjectIcon>
                  <ProjectDetails>
                    <ProjectName>
                      {editingId === project.id ? (
                        <>
                          <ProjectNameInput
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, project.id)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            placeholder="Название проекта"
                          />
                          <EditButtons>
                            <IconButton onClick={(e) => saveEdit(project.id, e)} color="#10b981">
                              ✓
                            </IconButton>
                            <IconButton onClick={cancelEdit} color="#ef4444">
                              ✕
                            </IconButton>
                          </EditButtons>
                        </>
                      ) : (
                        <>
                          <ProjectNameText>{project.name}</ProjectNameText>
                          <IconButton onClick={(e) => startEditing(project, e)} title="Редактировать название">
                            ✎
                          </IconButton>
                        </>
                      )}
                    </ProjectName>
                    <ProjectMeta>
                      <MetaItem>
                        <span>📐</span>
                        {project.width}×{project.height}
                      </MetaItem>
                      <MetaItem>
                        <span>📅</span>
                        {formatDate(project.createdAt)}
                      </MetaItem>
                      <MetaItem>
                        <span>🎨</span>
                        {countUniqueColors(project.canvas)} цветов
                      </MetaItem>
                    </ProjectMeta>
                  </ProjectDetails>
                </ProjectInfo>
                
                <ProjectActions>
                  <IconButton onClick={(e) => exportProject(project, e)} title="Экспорт в JSON">
                    📥
                  </IconButton>
                  <IconButton onClick={(e) => deleteProject(project.id, e)} title="Удалить проект" color="#ef4444">
                    🗑
                  </IconButton>
                </ProjectActions>
              </ProjectCard>
            ))}
        </ProjectsList>
      )}
      
      {projects.length > 0 && (
        <ProjectsFooter>
          Всего проектов: {projects.length} • Нажмите на проект для загрузки • Проекты автоматически сохраняются
        </ProjectsFooter>
      )}
    </ProjectsContainer>
  );
};

export default ProjectsManager;