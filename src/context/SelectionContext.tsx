// context/SelectionContext.tsx
import { createContext, useContext, useState } from "react";
import type { Pet } from "../types/pet";

const SelectionContext = createContext<any>(null);

export const SelectionProvider = ({ children }: any) => {
  const [selected, setSelected] = useState<Pet[]>([]);

  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);