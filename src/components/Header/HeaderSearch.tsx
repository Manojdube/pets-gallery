import { useCallback } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SearchSection,
  SearchInputWrapper,
  SearchInput,
  SearchClearButton,
} from "./Header.styles";

interface HeaderSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const HeaderSearch = ({
  searchQuery,
  onSearchChange,
}: HeaderSearchProps) => {
  const handleClear = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <SearchSection>
      <SearchInputWrapper>
        <SearchInput
          type="search"
          placeholder="Search pets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search pets by name or description"
        />
        {searchQuery && (
          <SearchClearButton
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear search"
          >
            <FontAwesomeIcon icon={faXmark} />
          </SearchClearButton>
        )}
      </SearchInputWrapper>
    </SearchSection>
  );
};