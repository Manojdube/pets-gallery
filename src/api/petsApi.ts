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

  // Add unique IDs and random file sizes to each pet
  return response.map((pet, index) => ({
    ...pet,
    id: `pet-${index}-${Date.now()}`,
    fileSize: Math.floor(Math.random() * (5000000 - 500000 + 1)) + 50000, // 500KB - 5MB
  }));
};