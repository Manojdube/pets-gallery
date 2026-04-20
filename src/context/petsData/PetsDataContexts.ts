import { createContext } from "react";
import type { Pet } from "../../types/pet";

export interface PetsDataContextType {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
}


export const PetsDataContext = createContext<PetsDataContextType | undefined>(undefined);
