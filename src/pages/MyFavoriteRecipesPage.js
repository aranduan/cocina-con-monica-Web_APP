// src/pages/MyFavoriteRecipesPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext'; // <--- IMPORTAR HOOK DE FAVORITOS
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://mock.apidog.com/m1/928607-911382-default';

function MyFavoriteRecipesPage() {
  const { currentUser } = useAuth();
  const { favoriteRecipeIds } = useFavorites(); // Obtenemos la lista de IDs favoritos

  const [favoriteRecipesDetails, setFavoriteRecipesDetails] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [errorFavorites, setErrorFavorites] = useState(null);

  useEffect(() => {
    if (favoriteRecipeIds.length === 0) {
      setFavoriteRecipesDetails([]);
      setLoadingFavorites(false);
      return; // No hay favoritos que cargar
    }

    const fetchFavoriteRecipeDetails = async () => {
      setLoadingFavorites(true);
      setErrorFavorites(null);
      try {
        // Hacemos una petición por cada ID de receta favorita
        // Promise.all espera a que todas las peticiones terminen
        const recipePromises = favoriteRecipeIds.map(id =>
          fetch(`${API_BASE_URL}/recipes/${id}`).then(res => {
            if (!res.ok) {
              // Si una receta individual falla al cargar, podríamos querer manejarlo
              // en lugar de hacer fallar todas. Por ahora, lo registramos.
              console.warn(`No se pudo cargar la receta favorita con ID: ${id}`);
              return null; // Devolvemos null para esta receta fallida
            }
            return res.json();
          })
        );
        
        const recipesData = await Promise.all(recipePromises);
        // Filtramos los nulos (recetas que no se pudieron cargar)
        setFavoriteRecipesDetails(recipesData.filter(recipe => recipe !== null));

      } catch (err) {
        console.error("Error al cargar detalles de recetas favoritas:", err);
        setErrorFavorites("Hubo un problema al cargar tus recetas favoritas.");
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavoriteRecipeDetails();
  }, [favoriteRecipeIds]); // Se re-ejecuta si la lista de IDs favoritos cambia

  if (loadingFavorites) {
    return <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '1.2em' }}>Cargando tus recetas favoritas...</p>;
  }

  if (errorFavorites) {
    return <p className="form-message error" style={{maxWidth: '600px', margin: '30px auto'}}>{errorFavorites}</p>;
  }

  return (
    <div style={{ paddingTop: '20px' }}>
      <h2>Mis Recetas Favoritas</h2>
      {currentUser && (
        <p style={{ fontSize: '1.1em', marginBottom: '20px', textAlign: 'center' }}>
          ¡Hola, {currentUser.name}! Aquí están tus recetas preferidas.
        </p>
      )}

      {favoriteRecipesDetails.length === 0 && !loadingFavorites && (
        <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc', borderRadius: '5px', marginTop: '20px' }}>
          <p>Aún no has añadido ninguna receta a tus favoritas.</p>
          <Link to="/recetas" className="home-button primary" style={{marginTop: '15px'}}>
            ¡Encuentra algunas para amar!
          </Link>
        </div>
      )}

      {/* Reutilizamos la clase .recipes-grid para mostrar las tarjetas */}
      {favoriteRecipesDetails.length > 0 && (
        <ul className="recipes-grid">
          {favoriteRecipesDetails.map(recipe => (
            // Reutilizamos la clase .recipe-list-item
            <li key={recipe.id} className="recipe-list-item">
              {recipe.imagen_url && (
                <img src={recipe.imagen_url} alt={recipe.nombre_receta} />
              )}
              <h3>
                <Link to={`/recetas/${recipe.id}`}>{recipe.nombre_receta || 'Receta sin nombre'}</Link>
              </h3>
              <p>{recipe.descripcion_corta || 'Prueba esta deliciosa receta.'}</p>
              {/* Puedes añadir un botón para quitar de favoritos aquí también si quieres */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyFavoriteRecipesPage;