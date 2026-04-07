// context/SelectionProvider.tsx
import { useMemo, useCallback, useState } from "react";
import type { Pet } from "../types/pet";
import { SelectionActionsContext, SelectionStateContext } from "./selectionContexts";

/**
 * SelectionProvider Component
 *
 * Provides selection management via context with two separate contexts:
 * - SelectionActionsContext: Stable action functions (no re-renders)
 * - SelectionStateContext: Selection state (causes re-renders when changed)
 *
 * This separation allows components using only actions to avoid unnecessary re-renders.
 */
export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<Pet[]>([]);

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
