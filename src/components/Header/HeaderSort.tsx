import { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  SortWrapper,
  SortTrigger,
  SortDropdown,
  SortGroupLabel,
  SortDropdownDivider,
  SortDropdownItem,
} from "./Header.styles";
import { SORT_OPTIONS } from "./Header.constants";
import type { SortOption } from "./Header.types";

interface HeaderSortProps {
  sortBy: SortOption;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSortChange?: (sort: SortOption) => void;
}

export const HeaderSort = ({
  sortBy,
  isOpen,
  onToggle,
  onClose,
  onSortChange,
}: HeaderSortProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeOption = SORT_OPTIONS.find((o) => o.value === sortBy) ?? SORT_OPTIONS[0];

  // Close on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (value: SortOption) => {
    onSortChange?.(value);
    onClose();
  };

  const nameOptions = SORT_OPTIONS.filter((o) => o.group === "name");
  const dateOptions = SORT_OPTIONS.filter((o) => o.group === "date");

  return (
    <SortWrapper ref={wrapperRef}>
      <SortTrigger
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Sort options"
        data-tooltip-id="header-tooltip"
        data-tooltip-content="Sort"
        data-tooltip-place="bottom"
      >
        <FontAwesomeIcon icon={activeOption.icon} style={{ fontSize: 14 }} />
        <span className="sort-label">{activeOption.label}</span>
        <FontAwesomeIcon icon={faChevronDown} className="sort-chevron" />
      </SortTrigger>

      {isOpen && (
        <SortDropdown role="listbox" aria-label="Sort by">
          <SortGroupLabel>Name</SortGroupLabel>
          {nameOptions.map((opt) => (
            <SortDropdownItem
              key={opt.value}
              $active={sortBy === opt.value}
              role="option"
              aria-selected={sortBy === opt.value}
              onClick={() => handleSelect(opt.value)}
            >
              <FontAwesomeIcon icon={opt.icon} style={{ fontSize: 13, width: 14 }} />
              {opt.label}
              <FontAwesomeIcon icon={faCheck} className="sort-check" />
            </SortDropdownItem>
          ))}

          <SortDropdownDivider />

          <SortGroupLabel>Date</SortGroupLabel>
          {dateOptions.map((opt) => (
            <SortDropdownItem
              key={opt.value}
              $active={sortBy === opt.value}
              role="option"
              aria-selected={sortBy === opt.value}
              onClick={() => handleSelect(opt.value)}
            >
              <FontAwesomeIcon icon={opt.icon} style={{ fontSize: 13, width: 14 }} />
              {opt.label}
              <FontAwesomeIcon icon={faCheck} className="sort-check" />
            </SortDropdownItem>
          ))}
        </SortDropdown>
      )}
    </SortWrapper>
  );
};
