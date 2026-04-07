import styled from "styled-components";
import PetCard from "./PetCard";
import type { Pet } from "../types/pet";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const NoResults = styled.p`
  text-align: center;
  color: #666;
  font-size: 1em;
  padding: 40px 20px;
`;

interface PetGalleryProps {
  pets: Pet[];
  selectedIds: Set<string>;
  onToggleSelection: (pet: Pet) => void;
}

export const PetGallery: React.FC<PetGalleryProps> = ({
  pets,
  selectedIds,
  onToggleSelection,
}) => {
  if (pets.length === 0) {
    return <NoResults>No pets found. Try adjusting your search or filters.</NoResults>;
  }

  return (
    <GridContainer>
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
          isSelected={selectedIds.has(pet.id)}
          onToggleSelection={onToggleSelection}
        />
      ))}
    </GridContainer>
  );
};
