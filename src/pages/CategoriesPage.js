// src/pages/CategoriesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://mock.apidog.com/m1/928607-911382-default';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error(`¡Error de la API al cargar categorías! Estado: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error al obtener las categorías:", err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <p>Cargando categorías de Mónica...</p>;
  }
  if (error) {
    return <p>Error al cargar las categorías: {error}.</p>;
  }
  if (!categories || categories.length === 0) {
    return <p>Mónica no ha definido ninguna categoría todavía.</p>;
  }

  return (
    <div>
      <h2>Categorías de Recetas</h2>
      <p>Explora las recetas de Mónica por su categoría:</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {categories.map(category => (
          <li key={category.id} className="category-list-item">
            <Link to={`/recetas?categoria=${category.id}`}>
              {category.nombre_categoria || 'Categoría sin nombre'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesPage;