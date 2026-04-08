// context/PetDetailProvider.tsx
import { useState, useCallback } from "react";
import type { Pet } from "../types/pet";
import { PetDetailContext } from "./petDetailContexts";

export const PetDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);

  const handleSetCurrentPet = useCallback((pet: Pet | null) => {
    setCurrentPet(pet);
  }, []);

  return (
    <PetDetailContext.Provider
      value={{
        currentPet,
        setCurrentPet: handleSetCurrentPet,
      }}
    >
      {children}
    </PetDetailContext.Provider>
  );
};
