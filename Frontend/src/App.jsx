import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/Layouts/MainLayout/MainLayout.jsx';
import Navbar from './Components/Layouts/Navbar/Navbar.jsx';
import MainPage from './Pages/MainPage/MainPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<h2>Página de Inicio (Dashboard)</h2>} />
          <Route path="/main-page" element={< MainPage/>} />
        </Route>


        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;