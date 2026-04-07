import styled from "styled-components";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const SelectionInfoGroup = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
`;

const SelectionInfo = styled.div`
  font-size: 1em;
  font-weight: 500;
  color: #333;
`;

const FileSize = styled.div`
  font-size: 0.95em;
  color: #666;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ClearButton = styled(Button)`
  background-color: #6c757d;
  border-color: #6c757d;

  &:hover {
    background-color: #545b62;
  }
`;

const DownloadButton = styled(Button)`
  background-color: #28a745;
  border-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

// Format bytes to readable size
const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

interface SelectionControlsProps {
  selectedCount: number;
  totalCount: number;
  totalFileSize: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDownload: () => void;
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
  selectedCount,
  totalCount,
  totalFileSize,
  onSelectAll,
  onClearSelection,
  onDownload,
}) => {
  return (
    <Header>
      <SelectionInfoGroup>
        <SelectionInfo>
          Selected: <strong>{selectedCount}</strong> / {totalCount}
        </SelectionInfo>
        {selectedCount > 0 && (
          <FileSize>
            Total Size: <strong>{formatFileSize(totalFileSize)}</strong>
          </FileSize>
        )}
      </SelectionInfoGroup>
      <ButtonGroup>
        <Button onClick={onSelectAll}>Select All</Button>
        <ClearButton onClick={onClearSelection} disabled={selectedCount === 0}>
          Clear Selection
        </ClearButton>
        <DownloadButton onClick={onDownload} disabled={selectedCount === 0}>
          Download ({selectedCount})
        </DownloadButton>
      </ButtonGroup>
    </Header>
  );
};
