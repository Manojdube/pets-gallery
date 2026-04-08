import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { usePetDetail } from '../context';
import type { Pet } from '../types/pet';

interface PetCardProps {
  pet: Pet;
  isSelected: boolean;
  onToggleSelection: (pet: Pet) => void;
}

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
  border: 2px solid ${(props) => (props.isSelected ? '#007bff' : '#ccc')};
  padding: 10px;
  display: flex;
  flex-direction: column;
  min-height: 250px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? '#f0f7ff' : 'white')};
  border-radius: 8px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PetImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
`;

const PetTitle = styled.h3`
  margin: 5px 0;
`;

const Description = styled.p`
  margin: 5px 0;
  font-size: 0.85em;
  color: #555;
  line-height: 1.3;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const LastUpdated = styled.p`
  margin: 5px 0 0 0;
  font-size: 0.75em;
  color: #999;
`;

const DetailsLink = styled.span`
  margin-top: auto;
  font-size: 0.8em;
  color: #007bff;
  text-decoration: underline;
`;

const PetCard: React.FC<PetCardProps> = ({ pet, isSelected, onToggleSelection }) => {
  const navigate = useNavigate();
  const { setCurrentPet } = usePetDetail();

  // Memoize handlers
  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleSelection(pet);
  }, [pet, onToggleSelection]);

  const handleCardClick = useCallback(() => {
    // Toggle selection and navigate to details
    onToggleSelection(pet);
    setCurrentPet(pet);
    setTimeout(() => {
      navigate(`/pets/${pet.id}`);
    }, 100);
  }, [navigate, pet, setCurrentPet, onToggleSelection]);

  // Memoize formatted date with time including seconds
  const formattedDate = useMemo(() => {
    return new Date(pet.created).toLocaleString();
  }, [pet.created]);

  return (
    <CardWrapper>
      <CheckboxContainer onClick={(e) => e.stopPropagation()}>
        <Checkbox
          id={`pet-checkbox-${pet.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
      </CheckboxContainer>
      <Card isSelected={isSelected} onClick={handleCardClick}>
        <PetImage src={pet.url} alt={pet.title} />
        <PetTitle>{pet.title}</PetTitle>
        <Description>{pet.description}</Description>
        <LastUpdated>Last updated: {formattedDate}</LastUpdated>
        <DetailsLink>View Details</DetailsLink>
      </Card>
    </CardWrapper>
  );
};

export default React.memo(PetCard);