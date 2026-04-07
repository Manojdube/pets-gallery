// pages/Home.tsx
import { usePets } from "../hooks/usePets";

const Home = () => {
  const { data, loading, error } = usePets();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No pets found</p>;

  return (
    <div>
      {data.map((pet) => (
        <div key={pet.id}>
          <img src={pet.url} width="200" />
          <h3>{pet.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Home;