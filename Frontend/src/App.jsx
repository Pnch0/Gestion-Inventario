import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {CreateProduct} from './Components/Users/CreateUser.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateProduct />} />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;