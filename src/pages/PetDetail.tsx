// pages/PetDetail.tsx
import { useParams } from "react-router-dom";

export const PetDetail = () => {
  const { id } = useParams();

  return <div>Pet ID: {id}</div>;
};