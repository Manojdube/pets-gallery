import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchPets as fetchPetsFromApi } from '../api/petsApi';
import type { Pet } from '../types/pet';

export interface PetsDataContextType {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  toggleSelection: (petId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isHydrated: boolean;
}

export const PetsDataContext = createContext<PetsDataContextType | undefined>(undefined);

const STORAGE_KEY = 'petGallery_petsData';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  pets: Pet[];
  timestamp: number;
}

export const PetsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Fetch all pets once on mount
  useEffect(() => {
    const loadPets = async () => {
      try {
        // Check localStorage cache first
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const cachedData: CachedData = JSON.parse(cached);
          const now = Date.now();
          
          // If cache is fresh, use it
          if (now - cachedData.timestamp < CACHE_DURATION) {
            setPets(cachedData.pets);
            setIsLoading(false);
            setIsHydrated(true);
            return;
          }
        }

        // Fetch from API if no cache or cache expired
        const fetchedPets = await fetchPetsFromApi();
        
        // Add selection state to pets
        const petsWithSelection = fetchedPets.map((pet) => ({
          ...pet,
          selected: false,
        }));

        // Save to cache
        const cacheData: CachedData = {
          pets: petsWithSelection,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));

        setPets(petsWithSelection);
        setIsLoading(false);
        setIsHydrated(true);
      } catch (err) {
        console.error('Error loading pets:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
        setIsHydrated(true);
      }
    };

    loadPets();
  }, []);

  // Save selection state to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated && pets.length > 0) {
      try {
        const cacheData: CachedData = {
          pets,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      } catch (err) {
        console.error('Failed to save pets to localStorage:', err);
      }
    }
  }, [pets, isHydrated]);

  const toggleSelection = useCallback((petId: string) => {
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === petId ? { ...pet, selected: !pet.selected } : pet
      )
    );
  }, []);

  const selectAll = useCallback(() => {
    setPets((prevPets) => prevPets.map((pet) => ({ ...pet, selected: true })));
  }, []);

  const clearSelection = useCallback(() => {
    setPets((prevPets) => prevPets.map((pet) => ({ ...pet, selected: false })));
  }, []);

  const value: PetsDataContextType = useMemo(
    () => ({
      pets,
      isLoading,
      error,
      toggleSelection,
      selectAll,
      clearSelection,
      isHydrated,
    }),
    [pets, isLoading, error, toggleSelection, selectAll, clearSelection, isHydrated]
  );

  return (
    <PetsDataContext.Provider value={value}>
      {children}
    </PetsDataContext.Provider>
  );
};

export const usePetsData = () => {
  const context = React.useContext(PetsDataContext);
  if (!context) {
    throw new Error('usePetsData must be used within PetsDataProvider');
  }
  return context;
};
