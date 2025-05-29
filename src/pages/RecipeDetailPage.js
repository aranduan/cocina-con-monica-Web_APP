// src/pages/RecipeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext'; // <--- IMPORTANTE

const API_BASE_URL = 'https://mock.apidog.com/m1/928607-911382-default';

function RecipeDetailPage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { recipeId } = useParams();

  const { addFavorite, removeFavorite, isFavorite } = useFavorites(); // <--- IMPORTANTE
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(false); // <--- IMPORTANTE

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
        if (!response.ok) {
          throw new Error(`¡Error de la API! Estado: ${response.status}. ¿El ID "${recipeId}" existe en Apidog?`);
        }
        const data = await response.json();
        setRecipe(data);
        // Verificar si es favorita DESPUÉS de cargar la receta
        if (data && data.id) { // Asegurarse que 'data' y 'data.id' existen
            setIsCurrentlyFavorite(isFavorite(data.id));
        }
      } catch (err) {
        console.error("Error al obtener el detalle de la receta:", err);
        setError(err.message);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetail();
  // La dependencia isFavorite es una función y puede causar re-renders si no está memoizada.
  // Dado que su definición en el contexto es estable, debería estar bien.
  // Si causa problemas, podríamos envolver isFavorite en useCallback en el contexto.
  // Por ahora, para simplificar, la quitamos de las dependencias si el problema persiste,
  // ya que solo necesitamos el valor inicial. Pero es mejor si el estado se actualiza.
  // Considera quitar 'isFavorite' de aquí si el botón no actualiza bien DESPUÉS de la carga inicial.
  }, [recipeId, isFavorite]); // Dependencia de isFavorite para actualizar si cambia externamente

  const handleToggleFavorite = () => {
    if (!recipe || !recipe.id) return; // Asegurarse que recipe y recipe.id existen
    if (isCurrentlyFavorite) {
      removeFavorite(recipe.id);
      setIsCurrentlyFavorite(false);
    } else {
      addFavorite(recipe.id);
      setIsCurrentlyFavorite(true);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '1.2em' }}>Cargando detalles de la receta...</p>;
  }
  if (error) {
    return <p className="form-message error" style={{maxWidth: '600px', margin: '30px auto'}}>Error al cargar la receta: {error}</p>;
  }
  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p>No se encontró la receta.</p>
        <Link to="/recetas" className="home-button primary" style={{marginTop: '15px'}}>Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <Link to="/recetas" style={{ display: 'block', marginBottom: '25px', fontSize: '1.1em', fontWeight: 'bold' }}>
        ← Volver a Todas las Recetas
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>{recipe.nombre_receta || 'Receta Desconocida'}</h2>
        <button 
            onClick={handleToggleFavorite}
            style={{
                padding: '8px 15px',
                fontSize: '0.9em',
                cursor: 'pointer',
                backgroundColor: isCurrentlyFavorite ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
            }}
        >
          {isCurrentlyFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
        </button>
      </div>

      {recipe.imagen_url && (
        <img src={recipe.imagen_url} alt={recipe.nombre_receta} />
      )}

      {recipe.descripcion_corta && <p>{recipe.descripcion_corta}</p>}

      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        {recipe.tiempo_preparacion_estimado && <p><strong>Tiempo de preparación:</strong> {recipe.tiempo_preparacion_estimado}</p>}
        {recipe.nivel_dificultad && <p><strong>Dificultad:</strong> {recipe.nivel_dificultad}</p>}
      </div>

      {recipe.ingredientes && recipe.ingredientes.length > 0 && (
        <>
          <h3>Ingredientes:</h3>
          <ul> 
            {recipe.ingredientes.map((ing, index) => (
              <li key={index}>
                {ing.cantidad}{ing.unidad ? ` ${ing.unidad}` : ''} de {ing.nombre}
              </li>
            ))}
          </ul>
        </>
      )}

      {recipe.pasos_preparacion && recipe.pasos_preparacion.length > 0 && (
        <>
          <h3>Pasos de Preparación:</h3>
          <ol>
            {recipe.pasos_preparacion.map((paso, index) => (
              <li key={index}>{paso}</li>
            ))}
          </ol>
        </>
      )}

      {recipe.episodio_referencia && <p style={{ marginTop: '20px', fontStyle: 'italic' }}><em>Referencia: {recipe.episodio_referencia}</em></p>}
      {recipe.notas_de_monica && <p style={{ marginTop: '10px', fontWeight: 'bold' }}><strong>Notas de Mónica:</strong> {recipe.notas_de_monica}</p>}
    </div>
  );
}
export default RecipeDetailPage;