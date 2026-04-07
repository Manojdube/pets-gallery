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

const SelectionInfo = styled.div`
  font-size: 1em;
  font-weight: 500;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
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

const Home = () => {
  const { data, loading, error } = usePets();
  const { toggleSelection, selectAll, clearSelection } = useSelectionActions();
  const { selected, selectedIds } = useSelectionState();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No pets found</p>;

  const selectionCount = selected.length;

  return (
    <Container>
      <Header>
        <SelectionInfo>
          Selected: <strong>{selectionCount}</strong> / {data.length}
        </SelectionInfo>
        <ButtonGroup>
          <Button onClick={() => selectAll(data)}>Select All</Button>
          <ClearButton onClick={clearSelection} disabled={selectionCount === 0}>
            Clear Selection
          </ClearButton>
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