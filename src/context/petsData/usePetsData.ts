import React from "react";
import { PetsDataContext } from "./PetsDataContexts";

export const usePetsData = () => {
  const context = React.useContext(PetsDataContext);
  if (!context) {
    throw new Error('usePetsData must be used within PetsDataProvider');
  }
  return context;
};