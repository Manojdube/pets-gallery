import { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import styled from "styled-components";

import { HeaderContainer } from "./Header.styles";
import { Logo } from "./HeaderLogo";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { HeaderSort } from "./HeaderSort";
import type { HeaderProps } from "./Header.types";

const NavLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 123, 255, 0.1);
    color: #0056b3;
  }
`;

// Row 1: Logo + Right actions
const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

// Row 2: Search full width (mobile only)
const SearchRow = styled.div`
  width: 100%;

  @media (min-width: 641px) {
    display: none; /* desktop pe hide — search TopRow mein hai */
  }
`;

// Search wrapper desktop pe TopRow ke andar
const DesktopSearch = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 16px;

  @media (max-width: 640px) {
    display: none; /* mobile pe hide — SearchRow mein hai */
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

// Mobile: 2-row wrapper
const HeaderInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (min-width: 641px) {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`;

export const Header = ({
  searchQuery,
  onSearchChange,
  selectedCount = 0,
  totalCount = 0,
  selectedTotalFileSize = "",
  sortBy = "nameAZ",
  onLogoClick,
  onSelectAll,
  onClearSelection,
  onDownload,
  onSortChange,
  isDownloading = false,
}: HeaderProps) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const searchEl = (
    <HeaderSearch
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
    />
  );

  return (
    <HeaderContainer role="banner">
      <HeaderInner>
        {/* Desktop: single row — Logo | Search | Actions */}
        {/* Mobile: TopRow only has Logo + Actions */}
        <TopRow>
          <Logo onLogoClick={onLogoClick} />

          {/* Search — desktop only, sits between logo and actions */}
          <DesktopSearch>{searchEl}</DesktopSearch>

          <RightSection>
            <HeaderActions
              selectedCount={selectedCount}
              totalCount={totalCount}
              selectedTotalFileSize={selectedTotalFileSize}
              onSelectAll={onSelectAll}
              onClearSelection={onClearSelection}
              onDownload={onDownload}
              isDownloading={isDownloading}
            />

            <HeaderSort
              sortBy={sortBy}
              isOpen={isSortOpen}
              onToggle={() => setIsSortOpen((v) => !v)}
              onClose={() => setIsSortOpen(false)}
              onSortChange={onSortChange}
            />

            <NavLink to="/about">About</NavLink>
          </RightSection>
        </TopRow>

        {/* Search — mobile only, full width second row */}
        <SearchRow>{searchEl}</SearchRow>
      </HeaderInner>

      <Tooltip id="header-tooltip" />
    </HeaderContainer>
  );
};
