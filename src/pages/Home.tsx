import { usePetsData, useSelection } from "../context";
import { Header } from "../components/Header/Header";
import { PetGallery } from "../components/PetGallery";
import { SkeletonLoader } from "../components/SkeletonLoader";
import {
  downloadSelectedPets,
  calculateTotalFileSize,
  formatFileSize,
} from "../utils/petUtils";
import type { Pet } from "../types/pet";
import styled from "styled-components";
import { useState, useCallback } from "react";
import { usePetFilters } from "../hooks/usePetFilters";

// Styles
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

const Home = () => {
  const { pets, isLoading, error } = usePetsData();
  const { selected, selectAll, clearSelection, toggleSelection } =
    useSelection();
  const {
    sortBy,
    searchQuery,
    filteredAndSortedData,
    handleSearchChange,
    handleSortChange,
  } = usePetFilters(pets, clearSelection);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleToggleSelection = useCallback(
    (pet: Pet) => toggleSelection(pet),
    [toggleSelection],
  );

  const scrollToTop = () => globalThis.scrollTo({ top: 0, behavior: "smooth" });

  const handleDownload = useCallback(async () => {
    if (selected.length === 0) return;

    setIsDownloading(true);
    try {
      await downloadSelectedPets(selected);
      // Clear selection immediately after successful download
      clearSelection();
      setIsDownloading(false);
    } catch (err) {
      console.error("Download failed:", err);
      setIsDownloading(false);
    }
  }, [selected, clearSelection]);

  const headerProps = {
    searchQuery,
    onSearchChange: handleSearchChange,
    selectedCount: selected.length,
    totalCount: pets.length,
    selectedTotalFileSize: formatFileSize(calculateTotalFileSize(selected)),
    sortBy,
    onLogoClick: scrollToTop,
    onSelectAll: () => selectAll(filteredAndSortedData),
    onClearSelection: clearSelection,
    onDownload: handleDownload,
    onSortChange: handleSortChange,
    isDownloading,
  } as const;

  if (error) {
    return (
      <PageContainer>
        <Header {...headerProps} />
        <ErrorContainer>Error loading pets: {error}</ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header {...headerProps} />
      {isLoading ? (
        <SkeletonLoader count={12} />
      ) : (
        <>
          {searchQuery && (
            <ResultsInfo>
              Found {filteredAndSortedData.length} result(s) for "{searchQuery}"
            </ResultsInfo>
          )}
          <PetGallery
            pets={filteredAndSortedData}
            onToggleSelection={handleToggleSelection}
          />
        </>
      )}
    </PageContainer>
  );
};

export default Home;
