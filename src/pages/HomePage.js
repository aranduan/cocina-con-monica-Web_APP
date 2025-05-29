// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page-container"> {/* Clase para estilos específicos de la página de inicio */}
      <h1>¡Bienvenida a Cocina con Mónica!</h1>
      <p className="home-intro-text">
        El lugar donde encontrarás todas las recetas icónicas de Mónica Geller y sus amigos.
        Desde la tarta de queso de la mamá de Chandler hasta los sándwiches de Acción de Gracias.
        ¡Prepárate para cocinar y revivir tus momentos favoritos de Friends!
      </p>
      
      {/* Opcional: Una imagen de bienvenida */}
      {/* <img 
        src="URL_DE_IMAGEN_DE_FRIENDS_O_MONICA_COCINANDO" 
        alt="Mónica cocinando" 
        className="home-welcome-image" 
      /> */}

      <div className="home-actions">
        <Link to="/recetas" className="home-button primary">
          Ver Todas las Recetas
        </Link>
        <Link to="/categorias" className="home-button secondary">
          Explorar Categorías
        </Link>
      </div>

      <div className="home-fun-fact">
        <h3>¿Sabías que...?</h3>
        <p>
          "Mónica solía ser chef en el restaurante Alessandro's y luego en Javu, ¡antes de empezar su propio catering!"
        </p>
      </div>
    </div>
  );
}
export default HomePage;