import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Prueba from './Pages/Prueba.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Prueba />} />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;