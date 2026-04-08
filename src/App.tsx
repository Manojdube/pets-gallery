// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/Home";
import { PetDetail } from "./pages/PetDetail";
import About from "./pages/About";
import { PetsDataProvider, PetDetailProvider } from "./context";

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fafafa;
  flex-direction: column;
  gap: 20px;
`;

const NotFoundTitle = styled.h1`
  font-size: 3em;
  color: #333;
  margin: 0;
`;

const NotFoundText = styled.p`
  font-size: 1.2em;
  color: #666;
  margin: 0;
`;

const HomeButton = styled.a`
  margin-top: 20px;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const NotFound = () => (
  <NotFoundContainer>
    <NotFoundTitle>404</NotFoundTitle>
    <NotFoundText>Page not found</NotFoundText>
    <HomeButton href="/">Return to Home</HomeButton>
  </NotFoundContainer>
);

function App() {
  return (
    <PetsDataProvider>
      <PetDetailProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PetDetailProvider>
    </PetsDataProvider>
  );
}

export default App;
