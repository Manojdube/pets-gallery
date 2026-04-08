import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import PetCard from './PetCard';
import type { Pet } from '../types/pet';

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;

    &:hover {
      background: #555;
    }
  }
`;

const PetGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    padding: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #666;
  font-size: 0.9em;
`;

interface VirtualizedPetGalleryProps {
  pets: Pet[];
  onToggleSelection: (pet: Pet) => void;
}

const ITEMS_PER_PAGE = 12;

/**
 * VirtualizedPetGallery Component
 *
 * Implements infinite scroll with lazy loading.
 * Only renders visible items to minimize DOM nodes.
 * Loads more items as user scrolls down.
 */
export const VirtualizedPetGallery: React.FC<VirtualizedPetGalleryProps> = ({
  pets,
  onToggleSelection,
}) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more items when scrolled 80% down
    if (scrollPercentage > 0.8) {
      setVisibleCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, pets.length)
      );
    }
  }, [pets.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const visiblePets = pets.slice(0, visibleCount);
  const hasMore = visibleCount < pets.length;

  return (
    <Container ref={containerRef}>
      <PetGalleryGrid>
        {visiblePets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            isSelected={pet.selected || false}
            onToggleSelection={onToggleSelection}
          />
        ))}
      </PetGalleryGrid>
      {hasMore && (
        <LoadingIndicator>
          Loading more... {visibleCount} of {pets.length}
        </LoadingIndicator>
      )}
    </Container>
  );
};
