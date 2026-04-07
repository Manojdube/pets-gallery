// styles/Grid.ts
import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  gap: 16px;

  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;