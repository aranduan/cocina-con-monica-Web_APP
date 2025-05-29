// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Creamos el "molde" para nuestro servicio de mensajería
const AuthContext = createContext(null);

// 2. Creamos el "Proveedor del Servicio de Mensajería" (Auth Provider)
// Este componente envolverá nuestra aplicación para dar acceso al servicio.
export function AuthProvider({ children }) {
  // Usamos useState para recordar quién tiene la llave (el usuario)
  // Inicialmente, nadie tiene la llave (null)
  const [currentUser, setCurrentUser] = useState(null);

  // Función para "obtener la llave" (login)
  // Por ahora, simularemos un login sencillo.
  // En una app real, aquí se contactaría a un servidor de verdad.
  const login = (username, password) => {
    // ¡SIMULACIÓN! Credenciales fijas para Mónica
    if (username === 'monica' && password === 'friends123') {
      const userData = {
        username: 'monica',
        name: 'Mónica Geller', // Nombre para mostrar
        // Podríamos añadir más datos si quisiéramos, como un email o un ID
      };
      setCurrentUser(userData); // ¡Usuario obtiene la llave!
      // Podríamos guardar la "llave" en el navegador para que no se pierda si recarga la página
      // localStorage.setItem('userToken', JSON.stringify(userData)); // Lo veremos si tenemos tiempo
      return true; // Login exitoso
    }
    return false; // Login fallido
  };

  // Función para "devolver la llave" (logout)
  const logout = () => {
    setCurrentUser(null); // Nadie tiene la llave
    // localStorage.removeItem('userToken'); // Si guardamos, también borramos
  };

  // Esto es lo que el servicio de mensajería ofrecerá a la aplicación:
  // - Quién tiene la llave actualmente (currentUser)
  // - La función para obtener la llave (login)
  // - La función para devolver la llave (logout)
  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Creamos un "Ayudante Mágico" (Custom Hook) para usar el servicio fácilmente
// Este es el custom hook solicitado.
// Se llamará `useAuth` y nos dará acceso rápido al `currentUser`, `login` y `logout`.
export function useAuth() {
  return useContext(AuthContext);
}