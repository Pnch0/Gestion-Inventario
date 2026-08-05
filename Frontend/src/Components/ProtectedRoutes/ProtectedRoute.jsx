import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const usuarioStorage = localStorage.getItem('usuario');
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;

    if (!token || !usuario) {
        return <Navigate to="/" replace />;
    }

    const rol = usuario?.perfil?.nombre_rol?.toLowerCase();

    if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(rol)) {
        return <Navigate to="/main-page" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;