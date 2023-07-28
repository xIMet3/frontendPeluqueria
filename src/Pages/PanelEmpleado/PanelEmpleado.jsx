import React, { useEffect, useState } from "react";
import "./PanelEmpleado.css";
import { useSelector } from "react-redux";
import { todasLasCitas } from "../../../Services/apiCalls";

export const PanelEmpleado = () => {
  const [citas, setCitas] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({});
  const [filterDate, setFilterDate] = useState(""); // Nuevo estado para el filtro de fecha
  const [currentPage, setCurrentPage] = useState(1);
  const citasPerPage = 20; // Número de citas por página

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
      return true; // Mostrar todas las citas si no hay filtro de fecha
    }

    // Formatear la fecha de la cita para que coincida con el formato del filtro
    const fechaCita = new Date(cita.fecha);
    const diaCita = fechaCita.getDate();
    const mesCita = fechaCita.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
    const anioCita = fechaCita.getFullYear();
    const fechaFormateada = `${anioCita}-${mesCita
      .toString()
      .padStart(2, "0")}-${diaCita.toString().padStart(2, "0")}`;

    return fechaFormateada === filterDate;
  };

  const handleChangeFilter = (event) => {
    setFilterDate(event.target.value);
    setCurrentPage(1); // Volver a la primera página al cambiar el filtro de fecha
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citasFiltradas.length > 0 ? (
            citasPaginadas.map((cita) => {
              const { fechaLocal, horaLocal } = formatearFecha(cita.fecha);
              const nombreCompleto = `${cita.Usuario?.nombre} ${cita.Usuario?.apellido}`;
              const estiloEstado =
                cita.Cita_estado?.nombre_cita_estado === "Pendiente"
                  ? { color: "orange" }
                  : {};

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
                    <td style={estiloEstado}>
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
                  {/* Desplegable con botones */}
                  {dropdownStates[cita.id] && (
                    <tr>
                      <td colSpan="10">
                        {/* Aquí utilizamos colSpan para que el contenedor de botones ocupe todas las columnas */}
                        <div className="botones-desplegable">
                          <button
                            id="botonModificar"
                            onClick={() => console.log("Modificar", cita.id)}
                          >
                            Modificar
                          </button>
                          <button
                            id="botonCancelar"
                            onClick={() => console.log("Cancelar", cita.id)}
                          >
                            Cancelar
                          </button>
                          <button
                            id="botonRealizada"
                            onClick={() => console.log("Realizada", cita.id)}
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
            // Mostrar mensaje si no hay citas filtradas
            <tr>
              <td colSpan="10">
                No se encontraron citas para la fecha seleccionada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
