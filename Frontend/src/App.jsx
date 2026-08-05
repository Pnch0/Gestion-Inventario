import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/Layouts/MainLayout/MainLayout.jsx';
import MainPage from './Pages/MainPage/MainPage.jsx';
import LoginPage from './Pages/Login/LoginPage.jsx';
import UsersPage from './Pages/Users/UsersPage.jsx';
import ProductsPage from './Pages/Products/ProductsPage.jsx';
import SalesPage from './Pages/Sales/SalesPage.jsx';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            
            <Route element={<ProtectedRoute allowedRoles={['administrador', 'vendedor', 'bodega']} />}>
              <Route path="/main-page" element={<MainPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
              <Route path="/users-page" element={<UsersPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['administrador', 'bodega']} />}>
              <Route path="/list-page" element={<ProductsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['administrador', 'vendedor']} />}>
              <Route path="/sales-page" element={<SalesPage />} />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;