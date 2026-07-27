import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/Layouts/MainLayout/MainLayout.jsx';
import MainPage from './Pages/MainPage/MainPage.jsx';
import LoginPage from './Pages/Login/LoginPage.jsx';
import UsersPage from './Pages/Users/UsersPage.jsx';
import ProductsPage from './Pages/Products/ProductsPage.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/main-page" element={<MainPage />} />
          <Route path="/users-page" element={<UsersPage />} />
          <Route path="/list-page" element={<ProductsPage />} />
        </Route>

        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;