// context/selectionContexts.ts
import { createContext } from "react";
import type { SelectionActionsType, SelectionStateType } from "./selectionTypes";

export const SelectionActionsContext = createContext<SelectionActionsType | null>(null);
export const SelectionStateContext = createContext<SelectionStateType | null>(null);
