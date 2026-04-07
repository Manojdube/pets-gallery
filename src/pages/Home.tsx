// pages/Home.tsx
import { usePets } from "../hooks/usePets";
import PetCard from "../components/PetCard";
import { useSelectionActions, useSelectionState } from "../context/SelectionContext";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
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

// Download selected images
const handleDownloadSelected = async (selected: any[]) => {
  for (const pet of selected) {
    try {
      const response = await fetch(pet.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pet.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Failed to download ${pet.title}:`, error);
    }
  }
};

const Home = () => {
  const { data, loading, error } = usePets();
  const { toggleSelection, selectAll, clearSelection } = useSelectionActions();
  const { selected, selectedIds } = useSelectionState();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No pets found</p>;

  const selectionCount = selected.length;
  const totalFileSize = selected.reduce((sum, pet) => sum + pet.fileSize, 0);

  return (
    <Container>
      <Header>
        <SelectionInfoGroup>
          <SelectionInfo>
            Selected: <strong>{selectionCount}</strong> / {data.length}
          </SelectionInfo>
          {selectionCount > 0 && (
            <FileSize>
              Total Size: <strong>{formatFileSize(totalFileSize)}</strong>
            </FileSize>
          )}
        </SelectionInfoGroup>
        <ButtonGroup>
          <Button onClick={() => selectAll(data)}>Select All</Button>
          <ClearButton onClick={clearSelection} disabled={selectionCount === 0}>
            Clear Selection
          </ClearButton>
          <DownloadButton
            onClick={() => handleDownloadSelected(selected)}
            disabled={selectionCount === 0}
          >
            Download ({selectionCount})
          </DownloadButton>
        </ButtonGroup>
      </Header>
      <GridContainer>
        {data.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            isSelected={selectedIds.has(pet.id)}
            onToggleSelection={toggleSelection}
          />
        ))}
      </GridContainer>
    </Container>
  );
};

export default Home;