// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { PetDetail } from "./pages/PetDetail";
import { SelectionProvider } from "./context";

function App() {
  return (
    <SelectionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets/:id" element={<PetDetail />} />
        </Routes>
      </BrowserRouter>
    </SelectionProvider>
  );
}

export default App;
