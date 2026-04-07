// context/SelectionContext.tsx
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { Pet } from "../types/pet";

interface SelectionActionsType {
  toggleSelection: (pet: Pet) => void;
  selectAll: (pets: Pet[]) => void;
  clearSelection: () => void;
}

interface SelectionStateType {
  selectedIds: Set<string>;
  selected: Pet[];
}

// Separate contexts - one for actions (stable), one for state (changes)
const SelectionActionsContext = createContext<SelectionActionsType | null>(null);
const SelectionStateContext = createContext<SelectionStateType | null>(null);

export const SelectionProvider = ({ children }: any) => {
  const [selected, setSelected] = useState<Pet[]>([]);

  // Create a Set for O(1) lookup
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

export const useSelectionActions = () => {
  const context = useContext(SelectionActionsContext);
  if (!context) {
    throw new Error("useSelectionActions must be used within SelectionProvider");
  }
  return context;
};

export const useSelectionState = () => {
  const context = useContext(SelectionStateContext);
  if (!context) {
    throw new Error("useSelectionState must be used within SelectionProvider");
  }
  return context;
};

// Backward compatibility hook
export const useSelection = () => {
  const actions = useSelectionActions();
  const state = useSelectionState();
  
  const isSelected = useCallback(
    (petId: string) => state.selectedIds.has(petId),
    [state.selectedIds]
  );

  return {
    ...actions,
    ...state,
    isSelected,
  };
};