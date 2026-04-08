import React, { createContext, useState, useEffect, useMemo } from 'react';
import { fetchPets as fetchPetsFromApi } from '../api/petsApi';
import type { Pet } from '../types/pet';

/**
 * PetsDataContextType - Shape of data provided by PetsDataProvider
 */
export interface PetsDataContextType {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
}

export const PetsDataContext = createContext<PetsDataContextType | undefined>(undefined);

const STORAGE_KEY = 'petGallery_petsData';
const SESSION_KEY = 'petGallery_sessionStarted';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  pets: Pet[];
  timestamp: number;
}

/**
 * Detect if page was hard reloaded (F5, Cmd+R, or browser refresh)
 * On hard reload: clears localStorage cache and forces fresh API fetch
 * @returns true if hard reload detected, false otherwise
 */
const isHardReload = (): boolean => {
  const sessionStarted = sessionStorage.getItem(SESSION_KEY);
  if (!sessionStarted) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
};

/**
 * PetsDataProvider - Manages pet data fetching and caching
 *
 * Features:
 * - Fetches pets from API on initial load
 * - Caches data in localStorage with 24-hour TTL
 * - Detects hard reload (F5/Cmd+R) and clears cache to force fresh fetch
 * - Shares pet data across entire app via context
 * - Pagination happens in PetGallery, not here
 *
 * Cache Strategy:
 * - Normal navigation: Uses cached data if available and fresh (<24hrs)
 * - Hard reload: Clears cache and fetches fresh data from API
 * - API failure: Shows error message to user
 * - Hydration: Components wait for isHydrated before rendering dependent UI
 */
export const PetsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const hardReload = isHardReload();

        if (!hardReload) {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const cachedData: CachedData = JSON.parse(cached);
            const now = Date.now();
            if (now - cachedData.timestamp < CACHE_DURATION) {
              setPets(cachedData.pets);
              setIsLoading(false);
              setIsHydrated(true);
              return;
            }
          }
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }

        const fetchedPets = await fetchPetsFromApi();
        const cacheData: CachedData = {
          pets: fetchedPets,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));

        setPets(fetchedPets);
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

  const value: PetsDataContextType = useMemo(
    () => ({
      pets,
      isLoading,
      error,
      isHydrated,
    }),
    [pets, isLoading, error, isHydrated]
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
