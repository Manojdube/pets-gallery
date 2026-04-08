// pages/Home.tsx
import { usePetsData } from "../context";
import { Header } from "../components/Header/Header";
import { type SortOption } from "../components/SortControls";
import { VirtualizedPetGallery } from "../components/VirtualizedPetGallery";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { filterAndSortPets, downloadSelectedPets } from "../utils/petUtils";
import type { Pet } from "../types/pet";
import styled from "styled-components";
import { useState, useMemo, useCallback } from "react";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fafafa;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
  margin: 20px;
`;

const ResultsInfo = styled.p`
  color: #666;
  font-size: 0.95em;
  margin: 0 0 10px 0;
`;

/**
 * Home Page Component
 *
 * Main gallery page with:
 * - Fetch all pets once at startup
 * - Selection state stored per pet object
 * - Virtualized grid for performance
 * - Skeleton loader for initial state
 * - Pet filtering by search query
 * - Pet sorting options
 * - Multi-select with download capability
 */
const Home = () => {
  const { pets, isLoading, error, toggleSelection, selectAll, clearSelection } = usePetsData();
  const [sortBy, setSortBy] = useState<SortOption>("nameAZ");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate selected count from pet objects
  const selectedCount = useMemo(
    () => pets.filter((pet) => pet.selected).length,
    [pets]
  );

  // Filter and sort data
  const filteredAndSortedData = useMemo(
    () => filterAndSortPets(pets, searchQuery, sortBy),
    [pets, searchQuery, sortBy]
  );

  // Get selected pets for download
  const selectedPets = useMemo(
    () => pets.filter((pet) => pet.selected),
    [pets]
  );

  // Memoized toggle handler
  const handleToggleSelection = useCallback(
    (pet: Pet) => {
      toggleSelection(pet.id);
    },
    [toggleSelection]
  );

  // Memoized select all handler
  const handleSelectAll = useCallback(() => {
    selectAll();
  }, [selectAll]);

  // Memoized clear selection handler
  const handleClearSelection = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Memoized download handler
  const handleDownload = useCallback(() => {
    downloadSelectedPets(selectedPets);
  }, [selectedPets]);

  if (error) {
    return (
      <PageContainer>
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCount={selectedCount}
          totalCount={pets.length}
          sortBy={sortBy}
          onLogoClick={() => globalThis.scrollTo({ top: 0, behavior: "smooth" })}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onDownload={handleDownload}
          onSortChange={setSortBy}
        />
        <ErrorContainer>Error loading pets: {error}</ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Unified Header with all controls */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedCount}
        totalCount={pets.length}
        sortBy={sortBy}
        onLogoClick={() => globalThis.scrollTo({ top: 0, behavior: "smooth" })}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onDownload={handleDownload}
        onSortChange={setSortBy}
      />

      {/* Show skeleton loader while loading */}
      {isLoading ? (
        <SkeletonLoader count={12} />
      ) : (
        <>
          {/* Results info */}
          {searchQuery && (
            <ResultsInfo>
              Found {filteredAndSortedData.length} result(s) for "{searchQuery}"
            </ResultsInfo>
          )}

          {/* Virtualized Gallery */}
          <VirtualizedPetGallery
            pets={filteredAndSortedData}
            onToggleSelection={handleToggleSelection}
          />
        </>
      )}
    </PageContainer>
  );
};

export default Home;