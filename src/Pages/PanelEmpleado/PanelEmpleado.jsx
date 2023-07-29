import React, { useEffect, useState } from "react";
import "./PanelEmpleado.css";
import { useSelector } from "react-redux";
import {
  todasLasCitas,
  modificarCancelarCita,
  modificarCitaRealizada,
} from "../../../Services/apiCalls";
import { useNavigate } from "react-router-dom";

export const PanelEmpleado = () => {
  const [citas, setCitas] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const citasPerPage = 20;
  const token = useSelector((state) => state.usuario.credentials.token);
  const navigate = useNavigate();

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

  const formatearFecha = (fecha) => {
    const fechaLocal = new Date(fecha).toLocaleDateString();
    const horaLocal = new Date(fecha).toLocaleTimeString();
    return { fechaLocal, horaLocal };
  };

  const toggleDropdown = (citaId) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [citaId]: !prevState[citaId],
    }));
  };

  const filtrarCitasPorFecha = (cita) => {
    if (!filterDate) {
      return true;
    }

    const fechaCita = new Date(cita.fecha);
    const diaCita = fechaCita.getDate();
    const mesCita = fechaCita.getMonth() + 1;
    const anioCita = fechaCita.getFullYear();
    const fechaFormateada = `${anioCita}-${mesCita
      .toString()
      .padStart(2, "0")}-${diaCita.toString().padStart(2, "0")}`;

    return fechaFormateada === filterDate;
  };

  const handleChangeFilter = (event) => {
    setFilterDate(event.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(citasFiltradas.length / citasPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastCita = currentPage * citasPerPage;
  const indexOfFirstCita = indexOfLastCita - citasPerPage;
  const citasFiltradas = citas.filter(filtrarCitasPorFecha);
  const citasPaginadas = citasFiltradas.slice(
    indexOfFirstCita,
    indexOfLastCita
  );

  const handleCancelarCita = async (citaId, estado) => {
    try {
      if (estado === "Cancelada") {
        await modificarCancelarCita(token, citaId);
        // Una vez se haya modificado actualiza el estado local
        setCitas((prevCitas) =>
          prevCitas.map((cita) =>
            cita.id === citaId
              ? { ...cita, Cita_estado: { nombre_cita_estado: "Cancelada" } }
              : cita
          )
        );
      } else if (estado === "Realizada") {
        await modificarCitaRealizada(token, citaId);
        // Una vez se haya marcado como realizada, actualiza el estado local
        setCitas((prevCitas) =>
          prevCitas.map((cita) =>
            cita.id === citaId
              ? { ...cita, Cita_estado: { nombre_cita_estado: "Realizada" } }
              : cita
          )
        );
      }
    } catch (error) {
      console.error("Error al modificar la cita:", error);
    }
  };

  // Ruta de la vista ModificadorCitaEmpleado
  const path = "/modificadorCitaEmpleado";

  // Función para modificar la cita y redirigir a la vista ModificadorCitaEmpleado
  const handleModificarCita = async (citaId) => {
    try {
      // Aquí puedes agregar la lógica para modificar la cita, si es necesario

      // Redirecciona al usuario a la vista "ModificadorCitaEmpleado"
      navigate(path);
    } catch (error) {
      console.error("Error al modificar la cita:", error);
    }
  };

  return (
    <div className="vistaEmpleadoEntera">
      <h1>Todas las citas existentes:</h1>
      <div>
        <label htmlFor="fechaFilter">Filtrar por fecha:</label>
        <input
          type="date"
          id="fechaFilter"
          value={filterDate}
          onChange={handleChangeFilter}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered citas-table">
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas.length > 0 ? (
              citasPaginadas.map((cita) => {
                const { fechaLocal, horaLocal } = formatearFecha(cita.fecha);
                const nombreCompleto = `${cita.Usuario?.nombre} ${cita.Usuario?.apellido}`;

                return (
                  <React.Fragment key={cita.id}>
                    <tr>
                      <td>{fechaLocal}</td>
                      <td>{horaLocal}</td>
                      <td>{nombreCompleto}</td>
                      <td>{cita.Usuario?.telefono}</td>
                      <td>{cita.Empleado?.nombre}</td>
                      <td>{cita.Servicio?.nombre_servicio}</td>
                      <td>{cita.Servicio?.precio_servicio}</td>
                      <td>{cita.comentario}</td>
                      <td
                        style={{
                          color:
                            cita.Cita_estado?.nombre_cita_estado === "Pendiente"
                              ? "orange"
                              : cita.Cita_estado?.nombre_cita_estado ===
                                "Cancelada"
                              ? "red"
                              : cita.Cita_estado?.nombre_cita_estado ===
                                "Realizada"
                              ? "green"
                              : "black",
                        }}
                      >
                        {cita.Cita_estado?.nombre_cita_estado}
                      </td>
                      <td>
                        <button
                          onClick={() => toggleDropdown(cita.id)}
                          id="botonOpciones"
                        >
                          Opciones
                        </button>
                      </td>
                    </tr>
                    {dropdownStates[cita.id] && (
                      <tr>
                        <td colSpan="10">
                          <div className="botones-desplegable">
                            {/* Llamamos a la función handleModificarCita al hacer clic en el botón */}
                            <button
                              id="botonModificar"
                              onClick={() => handleModificarCita(cita.id)}
                            >
                              Modificar
                            </button>
                            <button
                              id="botonCancelar"
                              onClick={() =>
                                handleCancelarCita(cita.id, "Cancelada")
                              }
                            >
                              Cancelar
                            </button>
                            <button
                              id="botonRealizada"
                              onClick={() =>
                                handleCancelarCita(cita.id, "Realizada")
                              }
                            >
                              Realizada
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="10">
                  No se encontraron citas para la fecha seleccionada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {currentPage > 1 && <button onClick={handlePrevPage}>Anterior</button>}
        {citasFiltradas.length > citasPerPage &&
          currentPage < Math.ceil(citasFiltradas.length / citasPerPage) && (
            <button onClick={handleNextPage}>Siguiente</button>
          )}
      </div>
    </div>
  );
};
