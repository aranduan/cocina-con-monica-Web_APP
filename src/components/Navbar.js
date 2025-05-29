// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content"> {/* Contenedor interno */}
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/recetas">Todas las Recetas</Link></li>
          <li><Link to="/categorias">Categorías</Link></li>
          {currentUser && (
            <>
              <li><Link to="/mis-favoritas">Mis Favoritas</Link></li>
              <li><Link to="/anadir-receta">Añadir Receta</Link></li>
            </>
          )}
        </ul>

        <div className="user-actions">
          {currentUser ? (
            <>
              <span>Hola, {currentUser.name}!</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            // AJUSTE: Envolver el Link de Login en un <li> para consistencia de estilos
            // Aunque user-actions no es un <ul>, los estilos para 'li' y 'a' dentro del navbar
            // podrían estar definidos de forma que esto ayude.
            // Si el CSS actual ya lo maneja bien sin el <li>, puedes omitir este cambio.
            // Pero por coherencia estructural con los otros links, es una buena práctica.
            <ul> {/* Se añade un ul aquí para que el li tenga un padre ul */}
              <li><Link to="/login">Login</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;