import React, { useEffect, useState } from "react";
import "./Servicios.css";
import { mostrarServicios } from "../../../Services/apiCalls";

export const Servicios = () => {
  // Estado local para almacenar los servicios
  const [servicios, setServicios] = useState([]);
  // Estado local para almacenar el servicio seleccionado
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // Efecto al montarse el componente
  useEffect(() => {
    // Funcion asincronica para obtener los servicios y establecer el estado local
    async function busquedaSevicios() {
      try {
        // Llamada a la API para obtener los servicios
        const res = await mostrarServicios();
        if (res.success) {
          setServicios(res.data);
        } else {
          console.error("Error al obtener los servicios:", res.message);
        }
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    }
    busquedaSevicios();
  }, []);

  return (
    <div className="fondoServicios">
      <div className="serviciosEntera">
        {/* Mostrar cada servicio como un boton */}
        {servicios.map((servicio) => (
          <button
            key={servicio.id}
            className="servicioItem"
            // Al hacer clic en un servicio, establecerlo como servicio seleccionado
            onClick={() => setServicioSeleccionado(servicio.id)}
          >
            <h3>{servicio.nombre_servicio}</h3>
            <p>Precio: {servicio.precio_servicio}</p>
            <p>Descripcion: {servicio.descripcion}</p>
          </button>
        ))}
      </div>

      {/* Mostrar el modal si hay un servicio seleccionado */}
      {servicioSeleccionado && (
        <div className="custom-modal">
          <div className="modal-content">
            {/* Mostrar el detalle del servicio seleccionado en el modal */}
            {servicios.map(
              (servicio) =>
                servicio.id === servicioSeleccionado && (
                  <div key={servicio.id} id="modalIndividual">
                    <h2>{servicio.nombre_servicio}</h2>
                    <p>Precio: {servicio.precio_servicio}</p>
                    <p>Descripcion: {servicio.descripcion}</p>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};