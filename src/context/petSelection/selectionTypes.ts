// context/selectionTypes.ts
import type { Pet } from "../../types/pet";

export interface SelectionActionsType {
  toggleSelection: (pet: Pet) => void;
  selectAll: (pets: Pet[]) => void;
  clearSelection: () => void;
}

export interface SelectionStateType {
  selectedIds: Set<string>;
  selected: Pet[];
}

export interface UseSelectionType extends SelectionActionsType, SelectionStateType {
  isSelected: (petId: string) => boolean;
}
