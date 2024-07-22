/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ allowedRoles }) => {
  // Obtener el rol del usuario desde la cookie
  const session = Cookies.get('session');
  const userRole = session ? Cookies.get('userRol') || '' : ''; // Obtener el rol del usuario desde la cookie 'userRol'
  
  // Verificar si el rol del usuario está en los roles permitidos

  const hasAccess = allowedRoles.includes(userRole);

  // Si no hay sesión, redirigir al login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está en los roles permitidos, redirigir al inicio
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  // Si el rol está permitido, renderizar el contenido de la ruta
  return <Outlet />;
};

export default ProtectedRoute;
