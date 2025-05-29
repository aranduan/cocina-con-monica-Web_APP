// src/pages/AddRecipePage.js
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // <--- ELIMINADO O COMENTADO
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'https://mock.apidog.com/m1/928607-911382-default';

function AddRecipePage() {
  // const navigate = useNavigate(); // <--- ELIMINADO O COMENTADO
  const { currentUser } = useAuth();

  // ... (el resto del código permanece exactamente igual que el que te di antes) ...
  // ... (useState, useEffect, handleSubmit, y el return con el JSX) ...

  const [nombreReceta, setNombreReceta] = useState('');
  const [descripcionCorta, setDescripcionCorta] = useState('');
  const [tiempoPreparacion, setTiempoPreparacion] = useState('');
  const [nivelDificultad, setNivelDificultad] = useState('Fácil');
  const [imagenUrl, setImagenUrl] = useState('');
  const [episodioReferencia, setEpisodioReferencia] = useState('');
  const [notasMonica, setNotasMonica] = useState('');
  const [ingredientesTexto, setIngredientesTexto] = useState('');
  const [pasosTexto, setPasosTexto] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('No se pudieron cargar las categorías.');
        const data = await response.json();
        setAllCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setSubmitMessage("Error al cargar categorías necesarias para el formulario.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const ingredientesArray = ingredientesTexto.split('\n').filter(line => line.trim() !== '').map(line => {
      const parts = line.split(',');
      return { nombre: parts[0]?.trim() || '', cantidad: parts[1]?.trim() || '', unidad: parts[2]?.trim() || '' };
    }).filter(ing => ing.nombre);

    const pasosArray = pasosTexto.split('\n').filter(line => line.trim() !== '').map(step => step.trim());

    const nuevaReceta = {
      nombre_receta: nombreReceta,
      descripcion_corta: descripcionCorta,
      ingredientes: ingredientesArray,
      pasos_preparacion: pasosArray,
      tiempo_preparacion_estimado: tiempoPreparacion,
      nivel_dificultad: nivelDificultad,
      imagen_url: imagenUrl,
      categoria_id: selectedCategoryId,
      episodio_referencia: episodioReferencia,
      notas_de_monica: notasMonica,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReceta),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Respuesta de error no es JSON o está vacía.' }));
        throw new Error(`Error de la API: ${response.status}. ${errorData.message || 'No se pudo añadir la receta.'}`);
      }

      const recetaCreada = await response.json();
      setSubmitMessage(`¡Receta "${recetaCreada.nombre_receta}" añadida con éxito! ID: ${recetaCreada.id}`);
      
      setNombreReceta(''); setDescripcionCorta(''); setTiempoPreparacion('');
      setNivelDificultad('Fácil'); setImagenUrl(''); setEpisodioReferencia('');
      setNotasMonica(''); setIngredientesTexto(''); setPasosTexto('');
      if (allCategories.length > 0) setSelectedCategoryId(allCategories[0].id);
      
      // La redirección está comentada para que veas el mensaje
      // // setTimeout(() => navigate('/recetas'), 3000); 

    } catch (error) {
      console.error("Error al enviar la receta:", error);
      setSubmitMessage(error.message || "Error desconocido al añadir la receta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page"> 
      <h2>Añadir Nueva Receta</h2>
      {currentUser && <p>¡Hola {currentUser.name}! Comparte una nueva receta.</p>}

      <form onSubmit={handleSubmit}>        
        <div>
          <label htmlFor="nombreReceta">Nombre de la Receta:</label>
          <input type="text" id="nombreReceta" value={nombreReceta} onChange={e => setNombreReceta(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="descripcionCorta">Descripción Corta:</label>
          <textarea id="descripcionCorta" value={descripcionCorta} onChange={e => setDescripcionCorta(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="ingredientesTexto">Ingredientes (uno por línea, formato: Nombre,Cantidad,Unidad):</label>
          <textarea id="ingredientesTexto" value={ingredientesTexto} onChange={e => setIngredientesTexto(e.target.value)} placeholder="Ej: Harina,250,gr
Azúcar,150,gr"/>
          <small>Ej: Leche,200,ml (luego presiona Enter para una nueva línea)</small>
        </div>

        <div>
          <label htmlFor="pasosTexto">Pasos de Preparación (uno por línea):</label>
          <textarea id="pasosTexto" value={pasosTexto} onChange={e => setPasosTexto(e.target.value)} placeholder="Ej: Precalentar el horno.
Mezclar ingredientes secos."/>
        </div>
        
        <div>
          <label htmlFor="tiempoPreparacion">Tiempo de Preparación Estimado:</label>
          <input type="text" id="tiempoPreparacion" value={tiempoPreparacion} onChange={e => setTiempoPreparacion(e.target.value)} placeholder="Ej: 30 minutos"/>
        </div>

        <div>
          <label htmlFor="nivelDificultad">Nivel de Dificultad:</label>
          <select id="nivelDificultad" value={nivelDificultad} onChange={e => setNivelDificultad(e.target.value)}>
            <option value="Fácil">Fácil</option>
            <option value="Media">Media</option>
            <option value="Difícil">Difícil</option>
          </select>
        </div>

        <div>
          <label htmlFor="imagenUrl">URL de la Imagen:</label>
          <input type="url" id="imagenUrl" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} placeholder="https://ejemplo.com/imagen.jpg"/>
        </div>

        <div>
          <label htmlFor="categoria">Categoría:</label>
          {loadingCategories ? <p>Cargando categorías...</p> : (
            <select id="categoria" value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} required>
              {allCategories.length === 0 && <option value="">No hay categorías disponibles</option>}
              {allCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="episodioReferencia">Episodio de Referencia (Opcional):</label>
          <input type="text" id="episodioReferencia" value={episodioReferencia} onChange={e => setEpisodioReferencia(e.target.value)} />
        </div>
        
        <div>
          <label htmlFor="notasMonica">Notas de Mónica (Opcional):</label>
          <textarea id="notasMonica" value={notasMonica} onChange={e => setNotasMonica(e.target.value)} />
        </div>

        <button type="submit" disabled={isSubmitting || loadingCategories}>
          {isSubmitting ? 'Añadiendo Receta...' : 'Añadir Receta'}
        </button>

        {submitMessage && (
          <p className={`form-message ${submitMessage.toLowerCase().includes('error') || submitMessage.toLowerCase().includes('falló') ? 'error' : 'success'}`}>
            {submitMessage}
          </p>
        )}
      </form>
    </div>
  );
}
export default AddRecipePage;