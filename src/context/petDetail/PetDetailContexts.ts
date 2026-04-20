// context/petDetailContexts.ts
import { createContext } from "react";
import type { Pet } from "../../types/pet";

export interface PetDetailContextType {
  currentPet: Pet | null;
  setCurrentPet: (pet: Pet | null) => void;
}

export const PetDetailContext = createContext<PetDetailContextType | undefined>(
  undefined
);
