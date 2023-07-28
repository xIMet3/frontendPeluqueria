import React, { useEffect, useState } from "react";
import "./PanelEmpleado.css";
import { useSelector } from "react-redux";
import { todasLasCitas } from "../../../Services/apiCalls";

export const PanelEmpleado = () => {
  const [citas, setCitas] = useState([]);
  const token = useSelector((state) => state.usuario.credentials.token);

  useEffect(() => {
    obtenerTodasLasCitas();
  }, []);

  const obtenerTodasLasCitas = async () => {
    try {
      const citasData = await todasLasCitas(token);
      setCitas(citasData.data);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  };

  // Función para formatear la fecha como local y separar la hora
  const formatearFecha = (fecha) => {
    const fechaLocal = new Date(fecha).toLocaleDateString();
    const horaLocal = new Date(fecha).toLocaleTimeString();
    return { fechaLocal, horaLocal };
  };

  return (
    <div className="vistaEmpleadoEntera">
      <h1>Todas las citas existentes:</h1>
      <table className="citas-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Usuario</th>
            <th>Teléfono</th>
            <th>Empleado</th>
            <th>Servicio</th>
            <th>Precio</th>
            <th>Comentario</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => {
            const { fechaLocal, horaLocal } = formatearFecha(cita.fecha);
            const nombreCompleto = `${cita.Usuario?.nombre} ${cita.Usuario?.apellido}`;
            const estiloEstado =
              cita.Cita_estado?.nombre_cita_estado === "Pendiente"
                ? { color: "orange" }
                : {};

            return (
              <tr key={cita.id}>
                <td>{fechaLocal}</td>
                <td>{horaLocal}</td>
                <td>{nombreCompleto}</td>
                <td>{cita.Usuario?.telefono}</td>
                <td>{cita.Empleado?.nombre}</td>
                <td>{cita.Servicio?.nombre_servicio}</td>
                <td>{cita.Servicio?.precio_servicio}</td>
                <td>{cita.comentario}</td>
                <td style={estiloEstado}>{cita.Cita_estado?.nombre_cita_estado}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
