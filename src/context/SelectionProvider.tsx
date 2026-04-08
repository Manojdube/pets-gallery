// context/SelectionProvider.tsx
import { useMemo, useCallback, useState, useEffect } from "react";
import type { Pet } from "../types/pet";
import { SelectionActionsContext, SelectionStateContext } from "./selectionContexts";

const STORAGE_KEY = "petGallery_selectedPets";

/**
 * SelectionProvider Component
 *
 * Provides selection management via context with two separate contexts:
 * - SelectionActionsContext: Stable action functions (no re-renders)
 * - SelectionStateContext: Selection state (causes re-renders when changed)
 *
 * This separation allows components using only actions to avoid unnecessary re-renders.
 * Selection state is persisted to localStorage for persistence across sessions.
 */
export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<Pet[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSelected(parsed);
      }
    } catch (error) {
      console.error("Failed to load selection from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever selection changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      } catch (error) {
        console.error("Failed to save selection to localStorage:", error);
      }
    }
  }, [selected, isHydrated]);

  // Create a Set for O(1) lookup performance
  const selectedIds = useMemo(() => {
    return new Set(selected.map((p) => p.id));
  }, [selected]);

  // Memoize actions - these are stable and won't change
  const toggleSelection = useCallback((pet: Pet) => {
    setSelected((prev) => {
      const isCurrentlySelected = prev.some((p) => p.id === pet.id);
      return isCurrentlySelected
        ? prev.filter((p) => p.id !== pet.id)
        : [...prev, pet];
    });
  }, []);

  const selectAll = useCallback((pets: Pet[]) => {
    setSelected(pets);
  }, []);

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const actionsValue = useMemo(
    () => ({
      toggleSelection,
      selectAll,
      clearSelection,
    }),
    [toggleSelection, selectAll, clearSelection]
  );

  const stateValue = useMemo(
    () => ({
      selectedIds,
      selected,
    }),
    [selectedIds, selected]
  );

  return (
    <SelectionActionsContext.Provider value={actionsValue}>
      <SelectionStateContext.Provider value={stateValue}>
        {children}
      </SelectionStateContext.Provider>
    </SelectionActionsContext.Provider>
  );
};
