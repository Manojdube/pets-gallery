// context/usePetDetail.ts
import { useContext } from "react";
import { PetDetailContext, type PetDetailContextType } from "./PetDetailContexts";

export const usePetDetail = (): PetDetailContextType => {
  const context = useContext(PetDetailContext);
  if (!context) {
    throw new Error("usePetDetail must be used within PetDetailProvider");
  }
  return context;
};
