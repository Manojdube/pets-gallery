export interface Pet {
  id: string;
  title: string;
  description: string;
  url: string;
  created: string;
  fileSize: number; // File size in bytes
  selected?: boolean; // Selection state stored per pet
}