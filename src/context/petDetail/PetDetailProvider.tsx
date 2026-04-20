import { useState, useCallback, useMemo } from "react";
import type { Pet } from "../../types/pet";
import { PetDetailContext } from "./PetDetailContexts";

export const PetDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);

  const handleSetCurrentPet = useCallback((pet: Pet | null) => {
    setCurrentPet(pet);
  }, []);
  
  const value = useMemo(
    () => ({
      currentPet,
      setCurrentPet: handleSetCurrentPet,
    }),
    [currentPet, handleSetCurrentPet]
  );

  return (
    <PetDetailContext.Provider value={value}>
      {children}
    </PetDetailContext.Provider>
  );
};