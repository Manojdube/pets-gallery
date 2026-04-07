import { useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { HeaderContainer, ActionsSection } from "./Header.styles";
import { Logo } from "./HeaderLogo";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { HeaderSort } from "./HeaderSort";
import type { HeaderProps } from "./Header.types";

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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <HeaderContainer role="banner">
      <Logo onLogoClick={onLogoClick} />

      <HeaderSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        isExpanded={isSearchExpanded}
        onExpandToggle={setIsSearchExpanded}
      />

      <ActionsSection>
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
      </ActionsSection>

      <Tooltip id="header-tooltip" />
    </HeaderContainer>
  );
};
