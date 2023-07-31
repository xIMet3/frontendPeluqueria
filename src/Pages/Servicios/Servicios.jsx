import React, { useEffect, useState } from "react";
import "./Servicios.css";
import { mostrarServicios } from "../../../Services/apiCalls";

export const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    async function fetchServicios() {
      try {
        const response = await mostrarServicios();
        if (response.success) {
          setServicios(response.data);
        } else {
          console.error("Error al obtener los servicios:", response.message);
        }
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    }
    fetchServicios();
  }, []);

  const openModal = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  const closeModal = () => {
    setSelectedServiceId(null);
  };

  return (
    <div className="serviciosBackground">
      <div className="serviciosEntera">
        {servicios.map((servicio) => (
          <button key={servicio.id} className="servicioItem">
            <h3>{servicio.nombre_servicio}</h3>
            <p>Precio: {servicio.precio_servicio}</p>
            <p>Descripción: {servicio.descripcion}</p>
          </button>
        ))}
      </div>

      {selectedServiceId && (
        <div className="custom-modal">
          <div className="modal-content">
            {servicios.map(
              (servicio) =>
                servicio.id === selectedServiceId && (
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
