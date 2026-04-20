import { useEffect, useState } from "react";
import { fetchPets } from "../api/petsApi";
import type { Pet } from "../types/pet";

const STORAGE_KEY = "petGallery_petsData";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);

        if (cached) {
          const { pets, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setPets(pets);
            setIsLoading(false);
            return;
          }
        }

        const fresh = await fetchPets();

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ pets: fresh, timestamp: Date.now() })
        );

        setPets(fresh);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return { pets, isLoading, error };
};