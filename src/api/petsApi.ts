// api/petsApi.ts
import { apiFetch } from "./http";
import type { Pet } from "../types/pet";

export const fetchPets = () => apiFetch<Pet[]>("/pets");