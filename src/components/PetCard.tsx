import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { usePetDetail } from "../context";
import type { Pet } from "../types/pet";
import ProgressiveImage from "./ProgressiveImage";

// Types
interface PetCardProps {
  pet: Pet;
  isSelected: boolean;
  onToggleSelection: (pet: Pet) => void;
}

/**
 * PetCard Component - Individual pet card in the gallery
 *
 * Features:
 * - Displays pet image, title, description, and last updated date
 * - Checkbox for quick selection toggle
 * - Click card to navigate to pet detail view
 * - Visual feedback for selected state (blue border + light background)
 * - Selection state does not change when viewing details
 *
 * Behavior:
 * - Checkbox click (with stopPropagation) → toggles selection without navigation
 * - Card click → navigates to detail view without affecting selection
 * - Memoized to prevent unnecessary re-renders when parent updates
 *
 * @component
 */

// Styles
const CardWrapper = styled.div`
  position: relative;
`;

const CheckboxContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const Card = styled.div<{ isSelected: boolean }>`
  border: 2px solid ${(props) => (props.isSelected ? "#007bff" : "#ccc")};
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 290px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? "#f0f7ff" : "white")};
  border-radius: 8px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PetInfoText = styled.p`
  margin: 5px 0;

  &:first-of-type {
    font-size: 1.05em;
    font-weight: 600;
  }
`;

const Description = styled(PetInfoText)`
  font-size: 0.85em;
  color: #555;
  line-height: 1.3;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const LastUpdated = styled(PetInfoText)`
  font-size: 0.75em;
  color: #999;
`;

const DetailsLink = styled.span`
  margin-top: auto;
  font-size: 0.8em;
  color: #007bff;
  text-decoration: underline;
`;

// Component
const PetCard: React.FC<PetCardProps> = ({
  pet,
  isSelected,
  onToggleSelection,
}) => {
  const navigate = useNavigate();
  const { setCurrentPet } = usePetDetail();

  const formattedDate = useMemo(
    () => new Date(pet.created).toLocaleString(),
    [pet.created],
  );

  /**
   * Handle checkbox change
   * stopPropagation prevents card click from being triggered
   */
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onToggleSelection(pet);
    },
    [pet, onToggleSelection],
  );

  /**
   * Handle card click (View Details)
   * Only navigates to detail view without affecting selection state
   */
  const handleCardClick = useCallback(() => {
    // Only navigate and set current pet, don't toggle selection
    setCurrentPet(pet);
    navigate(`/pets/${pet.id}`);
  }, [navigate, pet, setCurrentPet]);

  return (
    <CardWrapper>
      <CheckboxContainer onClick={(e) => e.stopPropagation()}>
        <Checkbox
          id={`pet-checkbox-${pet.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`Select ${pet.title}`}
        />
      </CheckboxContainer>
      <Card isSelected={isSelected} onClick={handleCardClick}>
        <ProgressiveImage
          src={pet.url}
          alt={pet.title}
          height={200}
          objectFit="cover"
        />
        <PetInfoText>{pet.title}</PetInfoText>
        <Description>{pet.description}</Description>
        <LastUpdated>Last updated: {formattedDate}</LastUpdated>
        <DetailsLink>View Details</DetailsLink>
      </Card>
    </CardWrapper>
  );
};

export default React.memo(PetCard);
