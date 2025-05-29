// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Herramientas para manejar las rutas, añadido Link por si se usa en 404
import './App.css'; // Se importa para estilos específicos que puedan quedar o añadirse a App.css

// Traer cada una de las páginas que hemos creado
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RecipesListPage from './pages/RecipesListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import MyFavoriteRecipesPage from './pages/MyFavoriteRecipesPage';
import AddRecipePage from './pages/AddRecipePage';

import Navbar from './components/Navbar'; // Trae el menú
import ProtectedRoute from './components/ProtectedRoute'; // Trae el componente que protege las rutas

function App() {
  return (
    // 1. CAMBIO: className="App" a className="app-container"
    <div className="app-container">
      <Navbar /> {/* Aquí colocamos el menú */}
      {/* 2. QUITAR: Título temporal si el Navbar ya cumple esa función o si la página de inicio tiene su propio título.
          Si quieres un título general aquí, puedes mantenerlo, pero usualmente se evita si hay navbar.
          // <h1>Casa Principal - Cocina con Mónica</h1> */}

      {/* 3. AÑADIR: Etiqueta <main> para envolver las Routes y darle un poco de padding */}
      <main style={{ paddingTop: '20px' }}>
        <Routes> {/* El "administrador" de todas las páginas */}
          {/* Página para la Entrada Principal */}
          <Route path="/" element={<HomePage />} />

          {/* Página con llave */}
          <Route path="/login" element={<LoginPage />} />

          {/* Página con todas las Recetas */}
          <Route path="/recetas" element={<RecipesListPage />} />

          {/* Página a una Receta Específica.
              ":recipeId" significa que esta parte de la URL puede cambiar.
              Ej: /recetas/1, /recetas/torta-de-chocolate */}
          <Route path="/recetas/:recipeId" element={<RecipeDetailPage />} />

          {/* Página a las Categorías */}
          <Route path="/categorias" element={<CategoriesPage />} />

          {/* ¡RUTAS PROTEGIDAS! */}
          <Route
            path="/mis-favoritas"
            element={
              <ProtectedRoute> {/* <--- El Guardia */}
                <MyFavoriteRecipesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anadir-receta"
            element={
              <ProtectedRoute> {/* <--- El Guardia */}
                <AddRecipePage />
              </ProtectedRoute>
            }
          />
          {/* Opcional: Ruta para páginas no encontradas (404) */}
          <Route 
            path="*" 
            element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>404 - Página No Encontrada</h2>
                <p>¡Ups! Parece que Mónica escondió esta página.</p>
                <Link to="/" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Volver al Inicio</Link>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}
// Este es el componente principal de nuestra aplicación
// Aquí es donde organizamos todas las páginas y componentes que hemos creado
// El componente App es como el menú principal de nuestra aplicación
// Dentro de App, podemos tener diferentes páginas y componentes
// BrowserRouter permite que las URLs cambien sin recargar la página
// Esto hace que la experiencia sea más rápida y fluida
// En resumen, App es el corazón de nuestra aplicación, donde todo se conecta y se organiza.
// Exportamos el componente App para que pueda ser usado en otros archivos
export default App;