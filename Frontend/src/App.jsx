import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/Layouts/MainLayout/MainLayout.jsx';
import Navbar from './Components/Layouts/Navbar/Navbar.jsx';
import MainPage from './Pages/MainPage/MainPage.jsx';
import LoginPage from './Pages/Login/LoginPage.jsx';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/main-page" element={< MainPage/>} />
        </Route>


        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;