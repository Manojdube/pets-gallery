import { useMemo, useCallback, useState, useEffect } from 'react';
import type { Pet } from '../types/pet';
import { SelectionActionsContext, SelectionStateContext } from './selectionContexts';

const STORAGE_KEY = 'petGallery_selectedPets';
const DEBOUNCE_DELAY = 300; // ms

/**
 * SelectionProvider manages pet selection state with localStorage persistence.
 * Uses a two-context pattern to separate immutable actions from mutable state,
 * preventing unnecessary re-renders in components that only need actions.
 *
 * Features:
 * - Persists selections to localStorage with debounced saves (300ms)
 * - Provides O(1) lookup performance via Set<petId>
 * - Automatically loads saved selections on mount
 * - Clears selections immediately on download/clear actions
 *
 * @example
 * <SelectionProvider>
 *   <YourComponent />
 * </SelectionProvider>
 */
export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<Pet[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load selections from localStorage on component mount
  // This ensures selections persist across page refreshes and route navigation
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSelected(parsed);
      }
    } catch (error) {
      console.error('Failed to load selection from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Debounced save to localStorage - saves after 300ms of inactivity
  // Debounce improves performance by reducing write frequency during rapid selections
  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      } catch (error) {
        console.error('Failed to save selection to localStorage:', error);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [selected, isHydrated]);

  // Create a Set for O(1) lookup performance when checking if a pet is selected
  // Used by PetGallery to efficiently determine which cards should show selected state
  const selectedIds = useMemo(() => new Set(selected.map((p) => p.id)), [selected]);

  /**
   * Toggle a pet's selection on/off
   * If pet is selected, removes it; otherwise adds it
   */
  const toggleSelection = useCallback((pet: Pet) => {
    setSelected((prev) => {
      const isCurrentlySelected = prev.some((p) => p.id === pet.id);
      return isCurrentlySelected ? prev.filter((p) => p.id !== pet.id) : [...prev, pet];
    });
  }, []);

  /**
   * Add multiple pets to selection without removing existing ones
   * Filters out pets that are already selected
   */
  const selectMultiple = useCallback((pets: Pet[]) => {
    setSelected((prev) => {
      const prevIds = new Set(prev.map((p) => p.id));
      const newPets = pets.filter((p) => !prevIds.has(p.id));
      return [...prev, ...newPets];
    });
  }, []);

  /**
   * Replace entire selection with provided pets array
   * Used by 'Select All' button on filtered/searched data
   */
  const selectAll = useCallback((pets: Pet[]) => {
    setSelected(pets);
  }, []);

  /**
   * Clear all selections immediately
   * Syncs to localStorage immediately (not debounced) to ensure
   * selections are cleared before download or navigation
   */
  const clearSelection = useCallback(() => {
    setSelected([]);
    // Immediately sync to localStorage to avoid debounce delays
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Failed to sync clearing selection to localStorage:', error);
    }
  }, []);

  /**
   * Remove a single pet from selection by ID
   */
  const removeSelection = useCallback((petId: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== petId));
  }, []);

  const actionsValue = useMemo(
    () => ({
      toggleSelection,
      selectMultiple,
      selectAll,
      clearSelection,
      removeSelection,
    }),
    [toggleSelection, selectMultiple, selectAll, clearSelection, removeSelection]
  );

  const stateValue = useMemo(
    () => ({
      selectedIds,
      selected,
      isHydrated,
      count: selected.length,
    }),
    [selectedIds, selected, isHydrated]
  );

  return (
    <SelectionActionsContext.Provider value={actionsValue}>
      <SelectionStateContext.Provider value={stateValue}>
        {children}
      </SelectionStateContext.Provider>
    </SelectionActionsContext.Provider>
  );
};
