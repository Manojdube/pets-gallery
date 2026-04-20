import styled from 'styled-components';
import { useSelection } from '../context';
import PetCard from './PetCard';
import { usePagination } from '../hooks/usePagination';
import type { Pet } from '../types/pet';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const GridContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PaginationContainer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 20px;
`;

const PaginationButton = styled.button<{ $isActive?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${(p) => (p.$isActive ? '#1976d2' : '#fff')};
  color: ${(p) => (p.$isActive ? '#fff' : '#333')};
  border-radius: 4px;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

interface Props {
  pets: Pet[];
  onToggleSelection: (pet: Pet) => void;
}

export const PetGallery: React.FC<Props> = ({ pets, onToggleSelection }) => {
  const { selectedIds } = useSelection();

  const {
    paginatedData,
    currentPage,
    totalPages,
    pageNumbers,
    next,
    prev,
    goToPage,
    hasNext,
    hasPrev,
  } = usePagination({ data: pets });

  if (pets.length === 0) {
    return <p>No pets found</p>;
  }

  const renderPageButton = (page: number | 'first' | 'last') => {
  if (page === 'first') {
    return (
      <PaginationButton key="first" onClick={() => goToPage(1)}>
        1
      </PaginationButton>
    );
  }

  if (page === 'last') {
    return (
      <PaginationButton key="last" onClick={() => goToPage(totalPages)}>
        {totalPages}
      </PaginationButton>
    );
  }

  return (
    <PaginationButton
      key={page}
      $isActive={page === currentPage}
      onClick={() => goToPage(page as number)}
    >
      {page}
    </PaginationButton>
  );
};

  return (
    <Container>
      <GridContainer>
        {paginatedData.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            isSelected={selectedIds.has(pet.id)}
            onToggleSelection={onToggleSelection}
          />
        ))}
      </GridContainer>

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton onClick={prev} disabled={!hasPrev}>
            ← Prev
          </PaginationButton>

          {pageNumbers.map(renderPageButton)}

          <PaginationButton onClick={next} disabled={!hasNext}>
            Next →
          </PaginationButton>
        </PaginationContainer>
      )}
    </Container>
  );
};