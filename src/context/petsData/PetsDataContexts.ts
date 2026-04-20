import { createContext } from "react";
import type { PetsDataContextType } from "./PetsDataProvider";


export const PetsDataContext = createContext<PetsDataContextType | undefined>(undefined);
