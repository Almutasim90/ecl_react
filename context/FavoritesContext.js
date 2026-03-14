import React, { createContext, useState, useContext, useCallback } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = useCallback((businessId) => {
    setFavorites((prev) => {
      if (prev.includes(businessId)) return prev;
      return [...prev, businessId];
    });
  }, []);

  const removeFavorite = useCallback((businessId) => {
    setFavorites((prev) => prev.filter((id) => id !== businessId));
  }, []);

  const toggleFavorite = useCallback((businessId) => {
    setFavorites((prev) => {
      if (prev.includes(businessId)) {
        return prev.filter((id) => id !== businessId);
      }
      return [...prev, businessId];
    });
  }, []);

  const isFavorite = useCallback(
    (businessId) => favorites.includes(businessId),
    [favorites]
  );

  const getFavoritesCount = useCallback(() => favorites.length, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        getFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
