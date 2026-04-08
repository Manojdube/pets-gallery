// pages/About.tsx
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fafafa;
`;

const Header = styled.header`
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;

  &:hover {
    background: #0056b3;
  }
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 1.5em;
`;

const Content = styled.main`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  flex: 1;

  h2 {
    color: #333;
    margin-top: 24px;
    margin-bottom: 12px;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  ul {
    color: #666;
    line-height: 1.8;
    margin-left: 20px;
  }
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <AboutContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        <LogoText>🐾 About myZoo</LogoText>
      </Header>

      <Content>
        <h2>Welcome to myZoo</h2>
        <p>
          myZoo is a pet gallery application built with modern React technologies. 
          It showcases best practices in state management, routing, and UI design.
        </p>

        <h2>Features</h2>
        <ul>
          <li>Browse a dynamic gallery of pets</li>
          <li>Select and manage multiple pets</li>
          <li>View detailed pet information with high-quality images</li>
          <li>Persistent selection state across page navigation</li>
          <li>Responsive design for all devices</li>
          <li>Download selected pet images</li>
        </ul>

        <h2>Technology Stack</h2>
        <ul>
          <li>React with TypeScript</li>
          <li>React Router for dynamic routing</li>
          <li>Context API for global state management</li>
          <li>Styled Components for styling</li>
          <li>FontAwesome for icons</li>
        </ul>

        <h2>About the Developer</h2>
        <p>
          Built by Manoj with a passion for clean code and great user experiences.
        </p>
      </Content>
    </AboutContainer>
  );
};

export default About;
