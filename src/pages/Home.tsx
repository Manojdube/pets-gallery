// pages/Home.tsx
import { usePets } from "../hooks/usePets";
import { useSelectionActions, useSelectionState } from "../context";
import { SearchBar } from "../components/SearchBar";
import { SortControls, type SortOption } from "../components/SortControls";
import { SelectionControls } from "../components/SelectionControls";
import { PetGallery } from "../components/PetGallery";
import { filterAndSortPets, downloadSelectedPets } from "../utils/petUtils";
import styled from "styled-components";
import { useState, useMemo } from "react";

const Container = styled.div`
  padding: 20px;
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
  const totalFileSize = selected.reduce((sum, pet) => sum + pet.fileSize, 0);

  return (
    <Container>
      <SelectionControls
        selectedCount={selectionCount}
        totalCount={data.length}
        totalFileSize={totalFileSize}
        onSelectAll={() => selectAll(data)}
        onClearSelection={clearSelection}
        onDownload={() => downloadSelectedPets(selected)}
      />

      <SortControls sortBy={sortBy} onSortChange={setSortBy} />

      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {searchQuery && (
        <ResultsInfo>
          Found {filteredAndSortedData.length} result(s) for "{searchQuery}"
        </ResultsInfo>
      )}

      <PetGallery
        pets={filteredAndSortedData}
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
      />
    </Container>
  );
};

export default Home;