import React, { useEffect } from 'react';
import styled from 'styled-components';
import { PixelCanvas } from './components/Canvas/Canvas';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ProjectsManager } from './components/ProjectsManager/ProjectsManager';
import { useCanvasStore } from './store/useCanvasStore';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(90deg, #054c76,#0c192a,#471c3a);
  padding: 10px;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
  
  @media (min-width: 1200px) {
    padding: 30px;
  }
`;

const MainContent = styled.main`
  max-width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  @media (min-width: 576px) {
    max-width: 540px;
    border-radius: 12px;
    padding: 20px;
  }
  
  @media (min-width: 768px) {
    max-width: 720px;
    border-radius: 16px;
    padding: 25px;
  }
  
  @media (min-width: 992px) {
    max-width: 960px;
    border-radius: 18px;
    padding: 28px;
  }
  
  @media (min-width: 1200px) {
    max-width: 1140px;
    border-radius: 20px;
    padding: 30px;
  }
  
  @media (min-width: 1400px) {
    max-width: 1320px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  
  @media (min-width: 576px) {
    font-size: 1.8rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 10px;
  }
  
  @media (min-width: 992px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  
  @media (min-width: 576px) {
    font-size: 1rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (min-width: 992px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const MainWorkspace = styled.div`
  flex: 1;
  min-width: 0; /* Для корректного сжатия */
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Sidebar = styled.aside`
  width: 100%;
  
  @media (min-width: 992px) {
    width: 320px;
    min-width: 320px;
    max-width: 400px;
    position: sticky;
    top: 20px;
  }
  
  @media (min-width: 1200px) {
    width: 350px;
    min-width: 350px;
  }
`;

const CanvasWrapper = styled.div`
  width: 100%;
  overflow: auto;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 15px;
  
  @media (min-width: 576px) {
    padding: 20px;
  }
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const ToolbarWrapper = styled.div`
  width: 100%;
`;

const ProjectsWrapper = styled.div`
  width: 100%;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 30px;
  color: #666;
  font-size: 0.8rem;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

function App() {
  const initializeCanvas = useCanvasStore((state) => state.initializeCanvas);

  useEffect(() => {
    initializeCanvas(32, 32);
  }, [initializeCanvas]);

  return (
    <AppContainer>
      <MainContent>
        <Header>
          <Title>Pixel Editor</Title>
          <Subtitle>Создавайте пиксель-арт прямо в браузере</Subtitle>
        </Header>

        <LayoutContainer>
          <MainWorkspace>
            <ToolbarWrapper>
              <Toolbar />
            </ToolbarWrapper>
            
            <CanvasWrapper>
              <PixelCanvas />
            </CanvasWrapper>
          </MainWorkspace>
          
          <Sidebar>
            <ProjectsWrapper>
              <ProjectsManager />
            </ProjectsWrapper>
          </Sidebar>
        </LayoutContainer>

        <Footer>
          <p>Pet-проект для портфолио | React + TypeScript | {new Date().getFullYear()}</p>
          <p>Используйте инструменты для создания пиксель-арта</p>
        </Footer>
      </MainContent>
    </AppContainer>
  );
}

export default App;