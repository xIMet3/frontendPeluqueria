import React, { useState, useEffect } from "react";
import "./ModificarCitaEmpleado.css";
import { modificarCita, mostrarEmpleados, mostrarServicios, obtenerEstadosCita } from "../../../Services/apiCalls";
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
    cita_estado_id: location.state?.cita_estado_id || "",
  });

  const [estadoCita, setEstadoCita] = useState(""); // Nuevo estado para almacenar el estado seleccionado

  // Estados para almacenar la lista de empleados, servicios y estados de cita
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "cita_estado_id") {
      setEstadoCita(value); // Guardar el estado seleccionado en el estado "estadoCita"
    } else {
      setCitaData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const fechaHora = new Date(`${citaData.fecha}T${citaData.hora}`);
      citaData.fecha = fechaHora.toISOString();

      // Agregar el estado seleccionado al objeto citaData antes de enviar la solicitud
      citaData.cita_estado_id = estadoCita;

      await modificarCita(token, citaData);

      // Restablecer los valores del formulario
      setCitaData({
        id: "",
        empleado_id: "",
        fecha: "",
        hora: "",
        servicio_id: "",
        comentario: "",
        cita_estado_id: "",
      });
      setEstadoCita(""); // Restablecer el estado seleccionado a un valor vacío
    } catch (error) {
      console.error("Error al modificar la cita:", error);
    }
  };

  // Cargar la lista de empleados, servicios y estados de cita al montar el componente
  useEffect(() => {
    obtenerEmpleados();
    obtenerServicios();
    obtenerEstados();
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

  // Función para cargar la lista de estados de cita
  const obtenerEstados = async () => {
    try {
      const responseEstadosCita = await obtenerEstadosCita(token);
      console.log(responseEstadosCita);
      setEstadosCita(responseEstadosCita.data); // Asignar el array de estados de cita a la variable estadosCita
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modificadorCitaEmpleado">
      <h1>Modificar Cita</h1>
      <form className="formulario" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="empleadoId"><strong>Empleado:</strong></label>
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
          <label htmlFor="nuevaFecha"><strong>Nueva Fecha:</strong></label>
          <input
            type="date"
            id="nuevaFecha"
            name="fecha"
            value={citaData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="nuevaHora"><strong>Nueva Hora:</strong></label>
          <input
            type="time"
            id="nuevaHora"
            name="hora"
            value={citaData.hora}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="nuevoServicio"><strong>Nuevo Servicio:</strong></label>
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
          <label htmlFor="nuevoComentario"><strong>Nuevo Comentario:</strong></label>
          <input
            type="text"
            id="nuevoComentario"
            name="comentario"
            value={citaData.comentario}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="nuevoEstado"><strong>Nuevo Estado:</strong></label>
          <select
            id="nuevoEstado"
            name="cita_estado_id"
            value={estadoCita} // Utilizar el estado "estadoCita" para el valor seleccionado
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un estado de cita</option>
            {estadosCita.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.nombre_cita_estado}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Modificar Cita</button>
      </form>
    </div>
  );
};
