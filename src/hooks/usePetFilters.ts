// hooks/usePetFilters.ts
import { useState, useMemo, useCallback } from 'react';
import { filterAndSortPets } from '../utils/petUtils';
import type { Pet } from '../types/pet';
import type { SortOption } from '../components/SortControls';

const DEFAULT_SORT: SortOption = 'nameAZ';
const DEFAULT_SEARCH = '';

export const usePetFilters = (
  pets: Pet[],
  clearSelection: () => void
) => {
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_SEARCH);

  const filteredAndSortedData = useMemo(
    () => filterAndSortPets(pets, searchQuery, sortBy),
    [pets, searchQuery, sortBy]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      clearSelection(); // keep your existing UX behavior
      setSearchQuery(query);
    },
    [clearSelection]
  );

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      clearSelection();
      setSortBy(sort);
    },
    [clearSelection]
  );

  return {
    sortBy,
    searchQuery,
    filteredAndSortedData,
    handleSearchChange,
    handleSortChange,
  };
};