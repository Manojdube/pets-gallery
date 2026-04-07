import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { SortOption } from "./SortControls";

export interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount?: number;
  totalCount?: number;
  sortBy?: SortOption;
  onLogoClick?: () => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDownload?: () => void;
  onSortChange?: (sort: SortOption) => void;
}

export interface SortOptionItem {
  value: SortOption;
  label: string;
  icon: IconDefinition;
  group: "name" | "date";
}
