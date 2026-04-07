import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchLabel = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.95em;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
  min-width: 250px;

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <SearchContainer>
      <SearchLabel htmlFor="search-input">Search:</SearchLabel>
      <SearchInput
        id="search-input"
        type="text"
        placeholder="Search by title or description..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </SearchContainer>
  );
};
