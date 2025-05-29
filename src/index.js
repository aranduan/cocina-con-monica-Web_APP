// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Estilos generales para toda la aplicación
import App from './App';   // Trae el componente App que acabamos de modificar
import { BrowserRouter } from 'react-router-dom'; // Para manejar las rutas de la aplicación
import { AuthProvider } from './contexts/AuthContext';// Importa nuestro proveedor
import { FavoritesProvider } from './contexts/FavoritesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter> {/* Aquí le decimos a React que vamos a usar rutas */}
  <AuthProvider> {/* Aquí le decimos a React que vamos a usar el servicio de autenticación */}
  <FavoritesProvider> {/* Aquí le decimos a React que vamos a usar el servicio de favoritos */}
    {/* El componente App es como el menú principal de nuestra aplicación */}
    {/* Dentro de App, podemos tener diferentes páginas y componentes */}
    {/* BrowserRouter permite que las URLs cambien sin recargar la página */}
    {/* Esto hace que la experiencia sea más rápida y fluida */}
    <App /> {/* Aquí le decimos: "Pinta el componente App en la pantalla" */}
  </FavoritesProvider>
  </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>
);