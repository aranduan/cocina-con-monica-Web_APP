// src/contexts/FavoritesContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState(() => {
    // Intentar cargar los favoritos desde localStorage al iniciar
    const savedFavorites = localStorage.getItem('monicaFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Guardar en localStorage cada vez que favoriteRecipeIds cambie
  useEffect(() => {
    localStorage.setItem('monicaFavorites', JSON.stringify(favoriteRecipeIds));
  }, [favoriteRecipeIds]);

  const addFavorite = (recipeId) => {
    if (!favoriteRecipeIds.includes(recipeId)) {
      setFavoriteRecipeIds(prevFavorites => [...prevFavorites, recipeId]);
    }
  };

  const removeFavorite = (recipeId) => {
    setFavoriteRecipeIds(prevFavorites => prevFavorites.filter(id => id !== recipeId));
  };

  const isFavorite = (recipeId) => {
    return favoriteRecipeIds.includes(recipeId);
  };

  const value = {
    favoriteRecipeIds, // La lista de IDs de recetas favoritas
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};