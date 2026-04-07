import type { Pet } from "../types/pet";
import type { SortOption } from "../components/SortControls";

/**
 * Download selected pet images
 */
export const downloadSelectedPets = async (selected: Pet[]): Promise<void> => {
  for (const pet of selected) {
    try {
      const response = await fetch(pet.url);
      const blob = await response.blob();
      const url = globalThis.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pet.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      globalThis.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error(`Failed to download ${pet.title}:`, error);
    }
  }
};

/**
 * Filter pets by search query (title or description)
 */
export const filterPets = (pets: Pet[], query: string): Pet[] => {
  if (!query.trim()) return pets;

  const lowerQuery = query.toLowerCase();
  return pets.filter(
    (pet) =>
      pet.title.toLowerCase().includes(lowerQuery) ||
      pet.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort pets based on sort option
 */
export const sortPets = (pets: Pet[], sortOption: SortOption): Pet[] => {
  const sorted = [...pets];

  switch (sortOption) {
    case "nameAZ":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "nameZA":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "dateNewest":
      return sorted.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    case "dateOldest":
      return sorted.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
    default:
      return sorted;
  }
};

/**
 * Filter and sort pets
 */
export const filterAndSortPets = (
  pets: Pet[],
  searchQuery: string,
  sortOption: SortOption
): Pet[] => {
  const filtered = filterPets(pets, searchQuery);
  return sortPets(filtered, sortOption);
};
