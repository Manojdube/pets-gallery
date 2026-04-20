import React, { useMemo } from "react";
import { PetsDataContext } from "./PetsDataContexts";
import { usePets } from "../../hooks/usePets";

export const PetsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pets, isLoading, error } = usePets();

  const value = useMemo(
    () => ({ pets, isLoading, error }),
    [pets, isLoading, error]
  );

  return (
    <PetsDataContext.Provider value={value}>
      {children}
    </PetsDataContext.Provider>
  );
};