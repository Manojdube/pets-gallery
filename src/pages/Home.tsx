import { usePetsData, useSelection } from '../context';
import { Header } from '../components/Header/Header';
import { type SortOption } from '../components/SortControls';
import { PetGallery } from '../components/PetGallery';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { filterAndSortPets, downloadSelectedPets, calculateTotalFileSize, formatFileSize } from '../utils/petUtils';
import type { Pet } from '../types/pet';
import styled from 'styled-components';
import { useState, useMemo, useCallback, useEffect } from 'react';

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

// Constants
const DEFAULT_SORT: SortOption = 'nameAZ';
const DEFAULT_SEARCH = '';
const SESSION_DEFAULTS_KEY = 'petGallery_sessionStarted';

/**
 * Home Page - Main gallery view for pets
 *
 * Features:
 * - Displays paginated grid of pets (12 items per page)
 * - Search pets by title/description
 * - Sort by name or date
 * - Multi-select pets with persistent state
 * - Download selected pets as images
 * - Auto-clear selections on search/sort to prevent stale selections
 * - Responsive layout (1 col mobile, 2 col tablet, 4 col desktop)
 *
 * State Management:
 * - PetsDataProvider: Manages pet data fetching and caching (24hr TTL)
 * - SelectionProvider: Manages pet selections with localStorage persistence
 * - Hard reload detection: Clears cache and selections on F5/Cmd+R
 */
const Home = () => {
  const { pets, isLoading, error } = usePetsData();
  const { selected, selectAll, clearSelection, toggleSelection } = useSelection();
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_SEARCH);
  const [isDownloading, setIsDownloading] = useState(false);

  // Reset state on hard reload (session start)
  useEffect(() => {
    const isNewSession = sessionStorage.getItem(SESSION_DEFAULTS_KEY) === 'true';
    if (isNewSession) {
      setSortBy(DEFAULT_SORT);
      setSearchQuery(DEFAULT_SEARCH);
      clearSelection();
      sessionStorage.removeItem(SESSION_DEFAULTS_KEY);
    }
  }, [clearSelection]);

  const filteredAndSortedData = useMemo(
    () => filterAndSortPets(pets, searchQuery, sortBy),
    [pets, searchQuery, sortBy]
  );

  const handleToggleSelection = useCallback(
    (pet: Pet) => toggleSelection(pet),
    [toggleSelection]
  );

  /**
   * Handle search input changes
   * Clears existing selections to prevent confusion with filtered results
   * Selections persist across searches but are cleared when new search starts
   */
  const handleSearchChange = useCallback(
    (query: string) => {
      clearSelection();
      setSearchQuery(query);
    },
    [clearSelection]
  );

  /**
   * Handle sort option changes
   * Clears existing selections to prevent confusion with re-ordered results
   */
  const handleSortChange = useCallback(
    (sort: SortOption) => {
      clearSelection();
      setSortBy(sort);
    },
    [clearSelection]
  );

  const scrollToTop = () => globalThis.scrollTo({ top: 0, behavior: 'smooth' });

  const handleDownload = useCallback(async () => {
    if (selected.length === 0) return;
    
    setIsDownloading(true);
    try {
      await downloadSelectedPets(selected);
      // Clear selection immediately after successful download
      clearSelection();
      setIsDownloading(false);
    } catch (err) {
      console.error('Download failed:', err);
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
          <PetGallery pets={filteredAndSortedData} onToggleSelection={handleToggleSelection} />
        </>
      )}
    </PageContainer>
  );
};

export default Home;