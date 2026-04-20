// pages/PetDetail.tsx
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { usePetDetail, usePetsData } from "../context";
import { useState, useCallback, useMemo } from "react";
import ProgressiveImage from "../components/ProgressiveImage";

const FullScreenContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-4px);
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  flex: 1;
  padding: 40px 24px;
  overflow: auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px 16px;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 2.5em;
  color: white;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.8em;
  }
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  margin: 0 0 24px 0;
  font-size: 1.1em;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const SizeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 1.05em;
  color: rgba(255, 255, 255, 0.9);
`;

const DownloadButton = styled.button`
  align-self: flex-start;
  background: #10b981;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PetImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  object-fit: contain;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
  font-size: 1.2em;
`;

export const PetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPet } = usePetDetail();
  const { pets, isLoading } = usePetsData();
  const [imageLoadError, setImageLoadError] = useState(false);

  // Try to get pet from context first (when clicked from card)
  // Fall back to finding in pets array (for refresh scenarios)
  const pet = useMemo(() => {
    if (currentPet) return currentPet;

    // If page is refreshed, find pet from the global pets array
    if (id && pets.length > 0) {
      return pets.find((p) => p.id === id);
    }

    return null;
  }, [currentPet, id, pets]);

  const handleDownload = useCallback(async () => {
    if (!pet) return;

    try {
      const response = await fetch(pet.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pet-${pet.title.replaceAll(" ", "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image");
    }
  }, [pet]);

  // Show loading if data is still loading
  if (isLoading) {
    return (
      <FullScreenContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        </Header>
        <LoadingContainer>Loading pet details...</LoadingContainer>
      </FullScreenContainer>
    );
  }

  // Show error if pet not found
  if (!pet) {
    return (
      <FullScreenContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        </Header>
        <LoadingContainer>
          Pet data not found. Please click on a pet card to view details.
        </LoadingContainer>
      </FullScreenContainer>
    );
  }

  return (
    <FullScreenContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
      </Header>

      <ContentWrapper>
        <LeftPanel>
          <Title>{pet.title}</Title>
          <Description>{pet.description}</Description>
          <SizeInfo>
            📦 <strong>{(pet.fileSize / 1024 / 1024).toFixed(2)} MB</strong>
          </SizeInfo>
          <DownloadButton onClick={handleDownload} title="Download image">
            ⬇️ Download Image
          </DownloadButton>
        </LeftPanel>

        <ImageWrapper>
          {imageLoadError ? (
            <div style={{ color: "white", textAlign: "center" }}>
              Failed to load image
            </div>
          ) : (
            <ProgressiveImage
              src={pet.url}
              alt={pet.title}
              height="80vh"
              objectFit="contain"
            />
          )}
        </ImageWrapper>
      </ContentWrapper>
    </FullScreenContainer>
  );
};
