import styled from 'styled-components';

// Types
export type SortOption = 'nameAZ' | 'nameZA' | 'dateNewest' | 'dateOldest';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'nameAZ', label: 'Name A-Z' },
  { value: 'nameZA', label: 'Name Z-A' },
  { value: 'dateNewest', label: 'Date (Newest First)' },
  { value: 'dateOldest', label: 'Date (Oldest First)' },
];

// Styles
const SortContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const SortLabel = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.95em;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9em;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

// Types & Props
interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

// Component
export const SortControls: React.FC<SortControlsProps> = ({ sortBy, onSortChange }) => (
  <SortContainer>
    <SortLabel htmlFor="sort-select">Sort by:</SortLabel>
    <Select id="sort-select" value={sortBy} onChange={(e) => onSortChange(e.target.value as SortOption)}>
      {SORT_OPTIONS.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  </SortContainer>
);
