// src/pages/RecipesListPage.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const API_BASE_URL = 'https://mock.apidog.com/m1/928607-911382-default';

function RecipesListPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState('Nuestras Recetas');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryIdFromUrl = queryParams.get('categoria');

    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      setRecipes([]); // Limpiar recetas previas para mejor feedback de carga

      let apiUrl = `${API_BASE_URL}/recipes`;

      if (categoryIdFromUrl) {
        // Asumimos que tu API de Apidog filtra por backend (lo confirmaste antes)
        apiUrl = `${API_BASE_URL}/recipes?categoria_id=${categoryIdFromUrl}`;
        // Mantenemos el título con el ID de categoría por simplicidad, como acordamos
        setPageTitle(`Recetas de la Categoría ${categoryIdFromUrl}`);
      } else {
        setPageTitle('Todas Nuestras Recetas');
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`¡Error de la API! Estado: ${response.status}`);
        }
        const data = await response.json();
        
        // Si categoryIdFromUrl existe Y tu API Apidog Mock NO filtra realmente por backend
        // (es decir, apiUrl contenía ?categoria_id=... pero la API devolvió todo),
        // entonces necesitas filtrar aquí en el frontend como un seguro.
        // Esta lógica es opcional si confías en que Apidog Mock filtra correctamente.
        if (categoryIdFromUrl && Array.isArray(data)) {
            const isPotentiallyUnfiltered = data.some(recipe => recipe.categoria_id !== categoryIdFromUrl);
            if (data.length > 0 && isPotentiallyUnfiltered) {
                 const filteredData = data.filter(recipe => recipe.categoria_id === categoryIdFromUrl);
                 if (filteredData.length < data.length) {
                     console.log("RecipesListPage: Filtro de seguridad en frontend aplicado porque la API no filtró por categoría como se esperaba.");
                 }
                 setRecipes(filteredData);
            } else {
                 setRecipes(data); // La API filtró o todas las recetas devueltas coinciden
            }
        } else {
            setRecipes(data); // No hay filtro por categoría o la data no es un array (poco probable)
        }

      } catch (err) {
        console.error("Error al obtener las recetas:", err);
        setError(err.message);
        // setRecipes([]); // Ya se limpió arriba
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [location.search]);

  if (loading) {
    // Aplicamos un estilo inline simple para el mensaje de carga
    return <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '1.2em' }}>Cargando recetas de Mónica...</p>;
  }
  if (error) {
    // Aplicamos la clase de mensaje de error para consistencia
    return <p className="form-message error" style={{maxWidth: '600px', margin: '30px auto'}}>Error al cargar las recetas: {error}.</p>;
  }
  
  // Ajuste en la condición para mostrar el mensaje de "no hay recetas"
  // Se muestra si no estamos cargando Y (no hay recetas O el array de recetas está vacío)
  const noRecipesFound = !loading && (!recipes || recipes.length === 0);

  return (
    // Puedes añadir una clase general a esta página si quieres, ej: className="recipes-list-page-container"
    <div>
      <h2>{pageTitle}</h2>
      {location.search && (
        // El estilo de este Link puede quedarse inline o moverse a una clase
        // si se va a reutilizar mucho un "botón/enlace de volver".
        <Link 
          to="/recetas" 
          style={{ 
            display: 'inline-block', // Para que el padding/margin funcione bien
            marginBottom: '20px', 
            padding: '8px 15px',
            backgroundColor: '#6c757d', // Un gris para "acción secundaria"
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '0.95em'
          }}
        >
          ← Ver todas las recetas
        </Link>
      )}

      {noRecipesFound && (
        <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc', borderRadius: '5px', marginTop: '20px' }}>
          <p>Mónica no ha publicado ninguna receta que coincida con estos criterios.</p>
          <Link to="/categorias" className="home-button secondary" style={{marginTop: '15px'}}>Ver otras categorías</Link>
        </div>
      )}

      <ul className="recipes-grid">
        {recipes.map(recipe => (
          <li key={recipe.id} className="recipe-list-item">
            {recipe.imagen_url && (
              <img src={recipe.imagen_url} alt={recipe.nombre_receta} />
            )}
            <h3>
              <Link to={`/recetas/${recipe.id}`}>{recipe.nombre_receta || 'Receta sin nombre'}</Link>
            </h3>
            <p>{recipe.descripcion_corta || 'Prueba esta deliciosa receta.'}</p>
            {recipe.tiempo_preparacion_estimado && <p><strong>Tiempo:</strong> {recipe.tiempo_preparacion_estimado}</p>}
            {recipe.nivel_dificultad && <p><strong>Dificultad:</strong> {recipe.nivel_dificultad}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default RecipesListPage;