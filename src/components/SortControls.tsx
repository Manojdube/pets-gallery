import styled from "styled-components";

type SortOption = "nameAZ" | "nameZA" | "dateNewest" | "dateOldest";

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

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ sortBy, onSortChange }) => {
  return (
    <SortContainer>
      <SortLabel htmlFor="sort-select">Sort by:</SortLabel>
      <Select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        <option value="nameAZ">Name A-Z</option>
        <option value="nameZA">Name Z-A</option>
        <option value="dateNewest">Date (Newest First)</option>
        <option value="dateOldest">Date (Oldest First)</option>
      </Select>
    </SortContainer>
  );
};

export type { SortOption };
