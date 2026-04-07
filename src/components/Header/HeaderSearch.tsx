import { useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  SearchSection,
  SearchIconButton,
  SearchInputWrapper,
  SearchInput,
  SearchClearButton,
} from "./Header.styles";

interface HeaderSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isExpanded: boolean;
  onExpandToggle: (expanded: boolean) => void;
}

export const HeaderSearch = ({
  searchQuery,
  onSearchChange,
  isExpanded,
  onExpandToggle,
}: HeaderSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input whenever the bar expands
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  // Ctrl/Cmd+K → expand & focus. Escape → collapse & clear.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onExpandToggle(true);
        return;
      }
      if (e.key === "Escape" && isExpanded) {
        onExpandToggle(false);
        onSearchChange("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, onSearchChange, onExpandToggle]);

  const handleSearchIconClick = useCallback(() => {
    onExpandToggle(!isExpanded);
  }, [isExpanded, onExpandToggle]);

  // Only collapse on blur if the focus isn't moving to the clear button
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const isClearButton = relatedTarget?.getAttribute("aria-label") === "Clear search";
      if (!searchQuery && !isClearButton) {
        onExpandToggle(false);
      }
    },
    [searchQuery, onExpandToggle]
  );

  const handleClear = useCallback(() => {
    onSearchChange("");
    inputRef.current?.focus();
  }, [onSearchChange]);

  const showClear = Boolean(searchQuery) && isExpanded;

  return (
    <SearchSection $isExpanded={isExpanded}>
      <SearchIconButton
        onClick={handleSearchIconClick}
        aria-label="Toggle search"
        data-tooltip-id="header-tooltip"
        data-tooltip-content="Search (Ctrl+K)"
        data-tooltip-place="bottom"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </SearchIconButton>

      <SearchInputWrapper>
        <SearchInput
          ref={inputRef}
          type="search"
          placeholder="Search pets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onBlur={handleBlur}
          $isExpanded={isExpanded}
          aria-label="Search pets by name or description"
          aria-describedby="search-hint"
        />
        <SearchClearButton
          onClick={handleClear}
          aria-label="Clear search"
          tabIndex={showClear ? 0 : -1}
          aria-hidden={showClear ? "false" : "true"}
          style={{ opacity: showClear ? 1 : 0, pointerEvents: showClear ? "auto" : "none" }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </SearchClearButton>
      </SearchInputWrapper>

      <span id="search-hint" style={{ display: "none" }}>
        Type to search. Press Ctrl+K to toggle. Press Escape to close.
      </span>
    </SearchSection>
  );
};