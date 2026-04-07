// pages/Home.tsx
import { usePets } from "../hooks/usePets";
import { useSelectionActions, useSelectionState } from "../context";
import { Header } from "../components/Header/Header";
import { type SortOption } from "../components/SortControls";
import { PetGallery } from "../components/PetGallery";
import { filterAndSortPets, downloadSelectedPets } from "../utils/petUtils";
import styled from "styled-components";
import { useState, useMemo } from "react";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fafafa;
`;

const Container = styled.div`
  padding: 20px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
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
 * - Unified Header with logo, search, selection controls, and sort
 * - Pet filtering by search query
 * - Pet sorting options
 * - Multi-select with download capability
 * - Responsive grid layout
 */
const Home = () => {
  const { data, loading, error } = usePets();
  const { toggleSelection, selectAll, clearSelection } = useSelectionActions();
  const { selected, selectedIds } = useSelectionState();
  const [sortBy, setSortBy] = useState<SortOption>("nameAZ");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort data - MUST be BEFORE early returns
  const filteredAndSortedData = useMemo(
    () => filterAndSortPets(data, searchQuery, sortBy),
    [data, searchQuery, sortBy]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No pets found</p>;

  const selectionCount = selected.length;

  return (
    <PageContainer>
      {/* Unified Header with all controls */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectionCount}
        totalCount={data.length}
        sortBy={sortBy}
        onLogoClick={() => globalThis.scrollTo({ top: 0, behavior: "smooth" })}
        onSelectAll={() => selectAll(data)}
        onClearSelection={clearSelection}
        onDownload={() => downloadSelectedPets(selected)}
        onSortChange={setSortBy}
      />

      <Container>
        {/* Results info */}
        {searchQuery && (
          <ResultsInfo>
            Found {filteredAndSortedData.length} result(s) for "{searchQuery}"
          </ResultsInfo>
        )}

        {/* Gallery */}
        <PetGallery
          pets={filteredAndSortedData}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
        />
      </Container>
    </PageContainer>
  );
};

export default Home;