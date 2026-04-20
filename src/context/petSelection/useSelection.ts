// context/useSelection.ts
import { useContext, useCallback } from "react";
import { SelectionActionsContext, SelectionStateContext } from "./selectionContexts";
import type { SelectionActionsType, SelectionStateType, UseSelectionType } from "./selectionTypes";

/**
 * Hook to access selection action functions (stable, doesn't cause re-renders)
 * Provides methods for modifying selections without triggering re-renders in most components
 *
 * @returns SelectionActionsType with methods: toggleSelection, selectMultiple, selectAll, clearSelection, removeSelection
 * @example
 * const { toggleSelection, clearSelection } = useSelectionActions();
 */
export const useSelectionActions = (): SelectionActionsType => {
  const context = useContext(SelectionActionsContext);
  if (!context) {
    throw new Error("useSelectionActions must be used within SelectionProvider");
  }
  return context;
};

/**
 * Hook to access selection state (selectedIds and selected pets)
 * Components using this hook re-render when selection changes
 *
 * @returns SelectionStateType with: selectedIds (Set), selected (Pet[]), count
 * @example
 * const { selected, selectedIds } = useSelectionState();
 */
export const useSelectionState = (): SelectionStateType => {
  const context = useContext(SelectionStateContext);
  if (!context) {
    throw new Error("useSelectionState must be used within SelectionProvider");
  }
  return context;
};

/**
 * Combined hook for backward compatibility
 * Provides all selection actions, state, and utility functions
 * Use this if you need both actions and state
 *
 * @returns UseSelectionType with actions, state, and isSelected utility method
 * @example
 * const { selected, toggleSelection, isSelected } = useSelection();
 * const isThisPetSelected = isSelected(petId); // O(1) lookup
 */
export const useSelection = (): UseSelectionType => {
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
