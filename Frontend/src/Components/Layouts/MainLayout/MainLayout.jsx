import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="layout-contenedor">
      <Navbar />

      <main className="layout-contenido">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;