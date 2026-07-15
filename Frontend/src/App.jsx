import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateProduct from './Components/Products/CreateProducts.jsx';
import ProductsList from './Components/Products/ProductsList.jsx';
import MainPage from './Pages/MainPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/list-product" element={<ProductsList />} />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;