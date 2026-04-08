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

  &:hover {
    background: rgba(0, 123, 255, 0.1);
    color: #0056b3;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Header = ({
  searchQuery,
  onSearchChange,
  selectedCount = 0,
  totalCount = 0,
  sortBy = "nameAZ",
  onLogoClick,
  onSelectAll,
  onClearSelection,
  onDownload,
  onSortChange,
}: HeaderProps) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <HeaderContainer role="banner">
      <Logo onLogoClick={onLogoClick} />

      <HeaderSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <RightSection>
        <HeaderActions
          selectedCount={selectedCount}
          totalCount={totalCount}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          onDownload={onDownload}
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

      <Tooltip id="header-tooltip" />
    </HeaderContainer>
  );
};
