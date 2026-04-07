// hooks/usePets.ts
import { useEffect, useState } from "react";
import { fetchPets } from "../api/petsApi";
import type { Pet } from "../types/pet";

export const usePets = () => {
  const [data, setData] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPets()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};