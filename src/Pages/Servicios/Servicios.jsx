import React, { useEffect, useState } from "react";
import "./Servicios.css";
import { mostrarServicios } from "../../../Services/apiCalls";

export const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  useEffect(() => {
    async function busquedaSevicios() {
      try {
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
        {servicios.map((servicio) => (
          <button key={servicio.id} className="servicioItem">
            <h3>{servicio.nombre_servicio}</h3>
            <p>Precio: {servicio.precio_servicio}</p>
            <p>Descripción: {servicio.descripcion}</p>
          </button>
        ))}
      </div>

      {servicioSeleccionado && (
        <div className="custom-modal">
          <div className="modal-content">
            {servicios.map(
              (servicio) =>
                servicio.id === servicioSeleccionado && (
                  <div key={servicio.id} id="modalIndividual">
                    <h2>{servicio.nombre_servicio}</h2>
                    <p>Precio: {servicio.precio_servicio}</p>
                    <p>Descripción: {servicio.descripcion}</p>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
