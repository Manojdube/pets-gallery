import React, { useState, useEffect, useMemo } from 'react';
import { fetchPets as fetchPetsFromApi } from '../../api/petsApi';
import type { Pet } from '../../types/pet';
import { PetsDataContext } from './PetsDataContexts';

export interface PetsDataContextType {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
}


const STORAGE_KEY = 'petGallery_petsData';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

interface CachedData {
  pets: Pet[];
  timestamp: number;
}

// ✅ Accurate reload detection
const isHardReload = (): boolean => {
  const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  return navEntries[0]?.type === 'reload';
};

export const PetsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const hardReload = isHardReload();

        // ✅ Use cache ONLY if NOT refresh
        if (!hardReload) {
          const cached = localStorage.getItem(STORAGE_KEY);

          if (cached) {
            const cachedData: CachedData = JSON.parse(cached);
            const isValid = Date.now() - cachedData.timestamp < CACHE_DURATION;

            if (isValid) {
              setPets(cachedData.pets);
              setIsLoading(false);
              setIsHydrated(true);
              return;
            }
          }
        }

        // 🔄 Refresh OR expired → fetch fresh
        const freshPets = await fetchPetsFromApi();

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            pets: freshPets,
            timestamp: Date.now(),
          })
        );

        setPets(freshPets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
        setIsHydrated(true);
      }
    };

    loadPets();
  }, []);

  const value = useMemo(
    () => ({ pets, isLoading, error, isHydrated }),
    [pets, isLoading, error, isHydrated]
  );

  return (
    <PetsDataContext.Provider value={value}>
      {children}
    </PetsDataContext.Provider>
  );
};