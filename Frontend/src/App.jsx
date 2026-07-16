import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesList from './Components/Sales/SalesList.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SalesList />} />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;