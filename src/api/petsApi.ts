// api/petsApi.ts
import { apiFetch } from "./http";
import type { Pet } from "../types/pet";

interface PetResponse {
  title: string;
  description: string;
  url: string;
  created: string;
}

export const fetchPets = async (): Promise<Pet[]> => {
  const response = await apiFetch<PetResponse[]>("/pets");
  
  // Add unique IDs to each pet based on index
  return response.map((pet, index) => ({
    ...pet,
    id: `pet-${index}-${Date.now()}`, // Generate unique ID
  }));
};