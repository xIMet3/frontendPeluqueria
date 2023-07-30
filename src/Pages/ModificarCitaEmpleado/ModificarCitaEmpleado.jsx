import React, { useState, useEffect } from "react";
import "./ModificarCitaEmpleado.css";
import { modificarCita, mostrarEmpleados, mostrarServicios, obtenerEstadosCita } from "../../../Services/apiCalls";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userData } from "../userSlice";

export const ModificadorCitaEmpleado = () => {
  const userState = useSelector(userData);
  const token = userState.credentials.token;
  const navigate = useNavigate();

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
      // Construir el objeto con los datos modificados
      const nuevaCitaData = {
        id: citaData.id,
        empleado_id: citaData.empleado_id,
        fecha: citaData.fecha,
        hora: citaData.hora,
        servicio_id: citaData.servicio_id,
        comentario: citaData.comentario,
        cita_estado_id: citaData.cita_estado_id,
      };

      // Modificar solo los campos que se han rellenado
      if (citaData.fecha && citaData.hora) {
        const fechaHora = new Date(`${citaData.fecha}T${citaData.hora}`);
        nuevaCitaData.fecha = fechaHora.toISOString();
      }

      if (estadoCita) {
        nuevaCitaData.cita_estado_id = estadoCita;
      }

      if (citaData.servicio_id) {
        nuevaCitaData.servicio_id = citaData.servicio_id;
      }

      if (citaData.comentario) {
        nuevaCitaData.comentario = citaData.comentario;
      }

      await modificarCita(token, nuevaCitaData);

      setCitaData({
        id: "",
        empleado_id: "",
        fecha: "",
        hora: "",
        servicio_id: "",
        comentario: "",
        cita_estado_id: "",
      });
      setEstadoCita("");

      // Redireccionar al panel del empleado después de modificar la cita con éxito
      navigate("/panelEmpleado");
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
      setEstadosCita(responseEstadosCita.data);
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
          />
        </div>
        <div>
          <label htmlFor="nuevoServicio"><strong>Nuevo Servicio:</strong></label>
          <select
            id="nuevoServicio"
            name="servicio_id"
            value={citaData.servicio_id}
            onChange={handleChange}
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
          />
        </div>
        <div>
          <label htmlFor="nuevoEstado"><strong>Nuevo Estado:</strong></label>
          <select
            id="nuevoEstado"
            name="cita_estado_id"
            value={estadoCita} // Utilizar el estado "estadoCita" para el valor seleccionado
            onChange={handleChange}
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
