// context/useSelection.ts
import { useContext, useCallback } from "react";
import { SelectionActionsContext, SelectionStateContext } from "./selectionContexts";
import type { SelectionActionsType, SelectionStateType, UseSelectionType } from "./selectionTypes";

/**
 * Hook to access selection action functions (stable, doesn't cause re-renders)
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
