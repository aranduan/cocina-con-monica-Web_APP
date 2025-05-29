// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Nuestro ayudante mágico

// Este componente recibe "children", que es la página protegida que queremos mostrar.
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth(); // Obtenemos quién tiene la llave
  const location = useLocation(); // Para recordar a dónde quería ir el usuario

  if (!currentUser) {
    // ¡No tiene la llave! Lo mandamos a /login.
    // "state={{ from: location }}" guarda la página de origen para volver después del login.
    // "replace" evita que el usuario pueda volver a la página protegida con el botón "atrás" del navegador.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ¡Tiene la llave! Le dejamos pasar y mostramos la página protegida.
  return children;
}

export default ProtectedRoute;