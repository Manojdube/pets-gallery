import type { Pet } from '../types/pet';
import type { SortOption } from '../components/SortControls';

// File Size Utilities
/**
 * Format bytes into human-readable file size (B, KB, MB, GB)
 * 
 * @param bytes - Number of bytes to format
 * @returns Formatted string (e.g., "2.5 MB", "512 KB")
 * @example
 * formatFileSize(2621440) // "2.5 MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  
  // Return whole numbers without decimals, otherwise 1 decimal place
  return size % 1 === 0 
    ? `${Math.floor(size)} ${units[i]}`
    : `${size.toFixed(1)} ${units[i]}`;
};

/**
 * Calculate total file size of selected pets
 * 
 * @param selected - Array of selected Pet objects
 * @returns Total size in bytes
 * @example
 * const totalBytes = calculateTotalFileSize([pet1, pet2, pet3]);
 */
export const calculateTotalFileSize = (selected: Pet[]): number => {
  return selected.reduce((total, pet) => total + (pet.fileSize || 0), 0);
};

/**
 * Download selected pets as individual image files
 *
 * Features:
 * - Downloads each pet image and triggers browser download
 * - Handles errors gracefully - continues downloading other pets if one fails
 * - Cleans up object URLs after download to prevent memory leaks
 *
 * @param selected - Array of Pet objects to download
 * @throws Errors are logged but not rethrown; download continues for other pets
 * @example
 * await downloadSelectedPets([pet1, pet2, pet3]);
 */
// Downloads
export const downloadSelectedPets = async (selected: Pet[]): Promise<void> => {
  if (selected.length === 0) return;

  for (const pet of selected) {
    try {
      const response = await fetch(pet.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = globalThis.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pet.title.replaceAll(' ', '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      globalThis.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Failed to download ${pet.title}:`, error);
    }
  }
};

// Filtering
/**
 * Filter pets by search query
 * Case-insensitive search on title and description fields
 *
 * @param pets - Array of pets to filter
 * @param query - Search string (case-insensitive)
 * @returns Filtered array of pets matching the query
 * @example
 * const results = filterPets(allPets, "cat");
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

// Sorting
/**
 * Sort pets by specified option
 * Creates a new sorted array without mutating the input
 *
 * Sort Options:
 * - 'nameAZ': Alphabetical A-Z by title
 * - 'nameZA': Reverse alphabetical Z-A by title
 * - 'dateNewest': Most recent first by created date
 * - 'dateOldest': Oldest first by created date
 *
 * @param pets - Array of pets to sort
 * @param sortOption - Which sort order to apply
 * @returns New sorted array
 * @example
 * const sorted = sortPets(pets, 'nameAZ');
 */
export const sortPets = (pets: Pet[], sortOption: SortOption): Pet[] => {
  const sorted = [...pets];

  switch (sortOption) {
    case 'nameAZ':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'nameZA':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'dateNewest':
      return sorted.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    case 'dateOldest':
      return sorted.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
    default:
      return sorted;
  }
};

// Combined
/**
 * Filter and sort pets in a single operation
 * Applies filter first, then sorts the filtered results
 * Used by Home page to get display data based on search and sort selections
 *
 * @param pets - Array of pets to process
 * @param searchQuery - Search query string (case-insensitive)
 * @param sortOption - Sort option to apply
 * @returns Filtered and sorted array of pets
 * @example
 * const displayed = filterAndSortPets(allPets, "dog", "nameAZ");
 */
export const filterAndSortPets = (
  pets: Pet[],
  searchQuery: string,
  sortOption: SortOption
): Pet[] => sortPets(filterPets(pets, searchQuery), sortOption);


export const getImageId = (url: string): string | null => {
  const match = url.match(/photos\/(\d+)\//);
  return match ? match[1] : null;
};