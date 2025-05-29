// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// Se eliminó 'Link' de la siguiente línea porque no se usa
import { useNavigate, useLocation } from 'react-router-dom'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Nombre de usuario o contraseña incorrectos.');
      }
    } catch (err) {
        console.error("Error en login:", err);
        setError('Ocurrió un problema al intentar iniciar sesión.');
    }
  };

  return (
    <div className="form-page">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="form-message error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      {/* 
      <p style={{textAlign: 'center', marginTop: '20px'}}>
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link> {/* Si descomentas esto, vuelve a importar Link arriba *}
      </p> 
      */}
    </div>
  );
}

export default LoginPage;