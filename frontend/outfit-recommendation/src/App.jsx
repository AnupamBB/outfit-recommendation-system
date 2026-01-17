import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./containers/ProductList";
import OutfitRecommendation from "./containers/OutfitRecommendation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/recommendations" element={<OutfitRecommendation />} />
        <Route path="*" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;