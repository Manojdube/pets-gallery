import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useSelection } from '../context';
import PetCard from './PetCard';
import type { Pet } from '../types/pet';

// Constants
const ITEMS_PER_PAGE = 12;
const MAX_PAGE_BUTTONS = 5;
const FIRST_PAGE = 1;

// Styles
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;

  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  /* Desktop: 4 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
`;

const NoResults = styled.p`
  text-align: center;
  color: #666;
  font-size: 1em;
  padding: 40px 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: ${(props) => (props.isActive ? '#1976d2' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#333')};
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 0.9em;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.isActive ? '#1565c0' : '#f0f0f0')};
  }
`;

const PaginationInfo = styled.span`
  color: #666;
  font-size: 0.9em;
  margin: 0 10px;
`;

// Types
interface PetGalleryProps {
  pets: Pet[];
  onToggleSelection: (pet: Pet) => void;
}

// Helpers
const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  // Calculate which page numbers to show, keeping current page in center
  const start = Math.max(FIRST_PAGE, currentPage - 2);
  const end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);
  const adjustedStart = Math.max(FIRST_PAGE, end - MAX_PAGE_BUTTONS + 1);

  const pages: (number | string)[] = [];

  if (adjustedStart > FIRST_PAGE) pages.push('first');
  for (let i = adjustedStart; i <= end; i++) pages.push(i);
  if (end < totalPages) pages.push('last');

  return pages;
};

/**
 * PetGallery Component - Responsive grid gallery with pagination
 *
 * Features:
 * - Displays 12 pets per page
 * - Responsive layout: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)
 * - Pagination controls with smart page number generation
 * - Integrates with SelectionProvider for selection state
 * - Auto-resets to page 1 when filtering/searching changes data
 *
 * @component
 */
// Component
export const PetGallery: React.FC<PetGalleryProps> = ({ pets, onToggleSelection }) => {
  const { selectedIds } = useSelection();
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);

  // Reset to first page when search/sort changes (detected by pets.length change)
  useEffect(() => {
    setCurrentPage(FIRST_PAGE);
  }, [pets.length]);

  const totalPages = useMemo(() => Math.ceil(pets.length / ITEMS_PER_PAGE), [pets.length]);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - FIRST_PAGE) * ITEMS_PER_PAGE;
    return pets.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [pets, currentPage]);

  if (pets.length === 0) {
    return <NoResults>No pets found. Try adjusting your search or filters.</NoResults>;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

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
          <PaginationButton
            onClick={() => setCurrentPage((p) => Math.max(FIRST_PAGE, p - 1))}
            disabled={currentPage === FIRST_PAGE}
          >
            ← Previous
          </PaginationButton>

          {pageNumbers.map((page) =>
            page === 'first' ? (
              <PaginationButton key="first" onClick={() => setCurrentPage(FIRST_PAGE)}>
                {FIRST_PAGE}
              </PaginationButton>
            ) : page === 'last' ? (
              <PaginationButton key="last" onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </PaginationButton>
            ) : (
              <PaginationButton
                key={page}
                isActive={page === currentPage}
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </PaginationButton>
            )
          )}

          <PaginationButton
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </PaginationButton>

          <PaginationInfo>
            Page {currentPage} of {totalPages}
          </PaginationInfo>
        </PaginationContainer>
      )}
    </Container>
  );
};
