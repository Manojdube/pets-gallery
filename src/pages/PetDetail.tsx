// pages/PetDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePets } from "../hooks/usePets";
import { useSelectionState, useSelectionActions } from "../context";
import { useCallback } from "react";

const FullScreenContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const SelectButton = styled(BackButton)<{ selected: boolean }>`
  background: ${(props) =>
    props.selected ? "rgba(52, 211, 153, 0.6)" : "rgba(255, 255, 255, 0.2)"};
  border-color: ${(props) =>
    props.selected
      ? "rgba(52, 211, 153, 1)"
      : "rgba(255, 255, 255, 0.3)"};
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow: hidden;
`;

const PetImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  object-fit: contain;
`;

const InfoPanel = styled.div`
  background: white;
  padding: 32px 24px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 2em;
  color: #333;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 12px 0;
  font-size: 1.05em;
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.span`
  font-size: 0.85em;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
  margin-top: 4px;
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = usePets();
  const { selectedIds } = useSelectionState();
  const { toggleSelection } = useSelectionActions();

  const pet = data.find((p) => p.id === id);
  const isSelected = pet ? selectedIds.has(pet.id) : false;

  const handleSelectToggle = useCallback(() => {
    if (pet) {
      toggleSelection(pet);
    }
  }, [pet, toggleSelection]);

  if (loading) {
    return (
      <FullScreenContainer>
        <LoadingContainer>Loading pet details...</LoadingContainer>
      </FullScreenContainer>
    );
  }

  if (error || !pet) {
    return (
      <FullScreenContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        </Header>
        <LoadingContainer>
          {error ? `Error: ${error}` : "Pet not found"}
        </LoadingContainer>
      </FullScreenContainer>
    );
  }

  return (
    <FullScreenContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        <SelectButton
          selected={isSelected}
          onClick={handleSelectToggle}
          title={isSelected ? "Remove from selection" : "Add to selection"}
        >
          {isSelected ? "✓ Selected" : "+ Select Pet"}
        </SelectButton>
      </Header>

      <ImageWrapper>
        <PetImage src={pet.url} alt={pet.title} />
      </ImageWrapper>

      <InfoPanel>
        <Title>{pet.title}</Title>
        <Description>{pet.description}</Description>

        <MetaInfo>
          <MetaItem>
            <MetaLabel>Added</MetaLabel>
            <MetaValue>{new Date(pet.created).toLocaleDateString()}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>File Size</MetaLabel>
            <MetaValue>{(pet.fileSize / 1024 / 1024).toFixed(2)} MB</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Pet ID</MetaLabel>
            <MetaValue>{pet.id.substring(0, 12)}...</MetaValue>
          </MetaItem>
        </MetaInfo>
      </InfoPanel>
    </FullScreenContainer>
  );
};