import React, { useState, useEffect } from "react";
import "./ModificarCitaEmpleado.css";
import { modificarCita, mostrarEmpleados, mostrarServicios } from "../../../Services/apiCalls";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { userData } from "../userSlice";

export const ModificadorCitaEmpleado = () => {
  const userState = useSelector(userData);
  const token = userState.credentials.token;

  const location = useLocation();

  const [citaData, setCitaData] = useState({
    id: location.state?.id || "",
    empleado_id: location.state?.empleado_id || "",
    fecha: location.state?.fecha || "",
    hora: location.state?.hora || "",
    servicio_id: location.state?.servicio_id || "",
    comentario: location.state?.comentario || "",
  });

  // Estados para almacenar la lista de empleados y servicios
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCitaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Combinar fecha y hora en un objeto Date
      const fechaHora = new Date(`${citaData.fecha}T${citaData.hora}`);
      citaData.fecha = fechaHora.toISOString(); // Convertir a formato ISO
      delete citaData.hora;

      // Llamar al método de la API para modificar la cita
      await modificarCita(token, citaData);

      // Limpiar el formulario después de la modificación exitosa
      setCitaData({
        id: "",
        empleado_id: "",
        fecha: "", // Cambiamos el campo "fecha" a una cadena vacía
        hora: "", // Agregamos un campo para la hora
        servicio_id: "",
        comentario: "",
        cita_estado_id: "",
      });
    } catch (error) {
      console.error("Error al modificar la cita:", error);
    }
  };

  // Cargar la lista de empleados y servicios al montar el componente
  useEffect(() => {
    obtenerEmpleados();
    obtenerServicios();
  }, []);

  // Función para cargar la lista de empleados
  const obtenerEmpleados = async () => {
    try {
      const responseEmpleados = await mostrarEmpleados();
      setEmpleados(responseEmpleados.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para cargar la lista de servicios
  const obtenerServicios = async () => {
    try {
      const responseServicios = await mostrarServicios();
      setServicios(responseServicios.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modificadorCitaEmpleado">
      <h1>Modificar Cita</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="empleadoId">Empleado:</label>
          <select
            id="empleadoId"
            name="empleado_id"
            value={citaData.empleado_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nuevaFecha">Nueva Fecha:</label>
          <input
            type="date"
            id="nuevaFecha"
            name="fecha"
            value={citaData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        {/* Agregamos un campo para la hora */}
        <div>
          <label htmlFor="nuevaHora">Nueva Hora:</label>
          <input
            type="time"
            id="nuevaHora"
            name="hora"
            value={citaData.hora}
            onChange={handleChange}
            required
          />
        </div>
        {/* Fin de los campos adicionales */}
        <div>
          <label htmlFor="nuevoServicio">Nuevo Servicio:</label>
          <select
            id="nuevoServicio"
            name="servicio_id"
            value={citaData.servicio_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre_servicio}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nuevoComentario">Nuevo Comentario:</label>
          <input
            type="text"
            id="nuevoComentario"
            name="comentario"
            value={citaData.comentario}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Modificar Cita</button>
      </form>
    </div>
  );
};
