import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faCircleXmark,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
  ActionsSection,
  IconOnlyButton,
  DownloadWrapper,
  CountBadge,
} from "./Header.styles";

interface HeaderActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export const HeaderActions = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onDownload,
  isDownloading = false,
}: HeaderActionsProps) => {
  const hasSelection = selectedCount > 0;
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const downloadLabel = hasSelection
    ? `Download ${selectedCount} ${selectedCount === 1 ? "item" : "items"}`
    : "Select items to download";

  return (
    <ActionsSection>
      {/* Select All */}
      <IconOnlyButton
        onClick={onSelectAll}
        disabled={totalCount === 0 || allSelected}
        aria-label={`Select all ${totalCount} items`}
        data-tooltip-id="header-tooltip"
        data-tooltip-content="Select all"
        data-tooltip-place="bottom"
      >
        <FontAwesomeIcon icon={faCheckDouble} />
      </IconOnlyButton>

      {/* Clear Selection */}
      <IconOnlyButton
        onClick={onClearSelection}
        disabled={!hasSelection}
        aria-label="Clear selection"
        data-tooltip-id="header-tooltip"
        data-tooltip-content="Clear selection"
        data-tooltip-place="bottom"
      >
        <FontAwesomeIcon icon={faCircleXmark} />
      </IconOnlyButton>

      {/* Download with badge */}
      <DownloadWrapper>
        <IconOnlyButton
          onClick={onDownload}
          disabled={!hasSelection || isDownloading}
          aria-label={downloadLabel}
          data-tooltip-id="header-tooltip"
          data-tooltip-content={isDownloading ? "Downloading..." : downloadLabel}
          data-tooltip-place="bottom"
          style={{ opacity: isDownloading ? 0.6 : 1 }}
        >
          <FontAwesomeIcon icon={faDownload} />
        </IconOnlyButton>
        <CountBadge $show={hasSelection} aria-hidden="true">
          {selectedCount}
        </CountBadge>
      </DownloadWrapper>
    </ActionsSection>
  );
};
