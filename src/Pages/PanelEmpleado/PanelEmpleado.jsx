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
  const [estadoDesplegable, setEstadoDesplegable] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const citasPorPagina = 20;
  const token = useSelector((state) => state.usuario.credentials.token);
  const navigate = useNavigate();

  // Efecto de montaje del componente
  useEffect(() => {
    obtenerTodasLasCitas();
  }, []);

  // Funcion para obtener todas las citas
  const obtenerTodasLasCitas = async () => {
    try {
      const citasData = await todasLasCitas(token);
      setCitas(citasData.data);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  };

  // Funcion para formatear la fecha y hora
  const formatearFecha = (fecha) => {
    const fechaLocal = new Date(fecha).toLocaleDateString();
    const horaLocal = new Date(fecha).toLocaleTimeString();
    return { fechaLocal, horaLocal };
  };

  // Funcion para alternar el estado del menu desplegable de cada cita
  const desplegable = (citaId) => {
    setEstadoDesplegable((prevState) => ({
      ...prevState,
      [citaId]: !prevState[citaId],
    }));
  };

  // Funcion para filtrar las citas por fecha
  const filtrarCitasPorFecha = (cita) => {
    if (!filterDate) {
      return true;
    }

    const fechaCita = new Date(cita.fecha);
    const diaCita = fechaCita.getDate();
    const mesCita = fechaCita.getMonth() + 1;
    const añoCita = fechaCita.getFullYear();
    const fechaFormateada = `${añoCita}-${mesCita
      .toString()
      .padStart(2, "0")}-${diaCita.toString().padStart(2, "0")}`;
    return fechaFormateada === filterDate;
  };

  // Funcion para filtrar las citas por nombre
  const filtrarCitasPorNombre = (cita) => {
    if (!filtroNombre) {
      return true;
    }
    const nombreUsuario = cita.Usuario?.nombre.toLowerCase();
    const nombreFiltrado = filtroNombre.toLowerCase();
    return nombreUsuario.includes(nombreFiltrado);
  };

  // Funcion para manejar el cambio del filtro por fecha
  const handleFiltroFecha = (event) => {
    setFilterDate(event.target.value);
    setPaginaActual(1); // Restablece la pagina actual a 1
  };

  // Funcion para manejar el cambio del filtro por nombre
  const handleFiltroNombre = (event) => {
    const inputName = event.target.value;
    if (inputName.length <= 40) {
      setFiltroNombre(inputName);
      setPaginaActual(1); // Restablece la pagina actual a 1
    }
  };

  // Funcion para manejar el botón de pagina siguiente
  const handlePaginaSiguiente = () => {
    const totalPages = Math.ceil(citasFiltradas.length / citasPorPagina);
    if (paginaActual < totalPages) {
      setPaginaActual((prevPage) => prevPage + 1);
    }
  };

  // Funcion para manejar el boton de pagina anterior
  const handlePaginaAnterior = () => {
    setPaginaActual((prevPage) => prevPage - 1);
  };

  // Calculo del indice de la ultima cita mostrada y la primera cita mostrada en la pagina actual
  const indexUltimaCita = paginaActual * citasPorPagina;
  const indexPrimeraCita = indexUltimaCita - citasPorPagina;

  // Filtro de fecha y filtro de nombre
  const citasFiltradas = citas
    .filter(filtrarCitasPorFecha)
    .filter(filtrarCitasPorNombre);

  // Obtener las citas que se mostraran en la pagina actual
  const citasPaginadas = citasFiltradas.slice(
    indexPrimeraCita,
    indexUltimaCita
  );

  // Funcion para manejar el botón de cancelar cita
  const handleCancelarCita = async (citaId, estado) => {
    try {
      if (estado === "Cancelada") {
        await modificarCancelarCita(token, citaId);
        // Una vez se haya modificado, actualiza el estado local
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

  // Funcion para redirigir a la vista ModificadorCitaEmpleado con la id de la cita seleccionada para modificar
  const handleModificarCita = async (citaId) => {
    try {
      navigate(path, { state: { id: citaId } });
    } catch (error) {
      console.error("Error al modificar la cita:", error);
    }
  };

  return (
    <div className="vistaEmpleadoEntera">
      <h1>Todas las citas existentes:</h1>
      <div className="filters-container">
        {/* Filtro por fecha */}
        <div className="filter-date">
          <label htmlFor="fechaFilter">Filtrar por fecha:</label>
          <input
            type="date"
            id="fechaFilter"
            value={filterDate}
            onChange={handleFiltroFecha}
          />
        </div>
        {/* Filtro por nombre */}
        <div className="filter-name">
          <label htmlFor="nombreFilter">Filtrar por nombre: </label>
          <input
            type="text"
            id="nombreFilter"
            value={filtroNombre}
            onChange={handleFiltroNombre}
          />
        </div>
      </div>
      {/* Tabla de citas */}
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
            {/* Si hay citas filtradas para mostrar */}
            {citasFiltradas.length > 0 ? (
              citasPaginadas.map((cita) => {
                const { fechaLocal, horaLocal } = formatearFecha(cita.fecha);
                const nombreCompleto = `${cita.Usuario?.nombre} ${cita.Usuario?.apellido}`;

                return (
                  <React.Fragment key={cita.id}>
                    <tr>
                      <td>{fechaLocal}</td>
                      <td>{horaLocal}</td>
                      <td>
                        <strong style={{ color: "darkred" }}>
                          {nombreCompleto}
                        </strong>
                      </td>
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
                          onClick={() => desplegable(cita.id)}
                          id="botonOpciones"
                        >
                          Opciones
                        </button>
                      </td>
                    </tr>
                    {/* Despliegue de opciones */}
                    {estadoDesplegable[cita.id] && (
                      <tr>
                        <td colSpan="10">
                          <div className="botones-desplegable">
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
                  No se encontraron citas para la fecha y el nombre
                  seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="pagination">
        {paginaActual > 1 && (
          <button onClick={handlePaginaAnterior}>Anterior</button>
        )}
        {citasFiltradas.length > citasPorPagina &&
          paginaActual < Math.ceil(citasFiltradas.length / citasPorPagina) && (
            <button onClick={handlePaginaSiguiente}>Siguiente</button>
          )}
      </div>
    </div>
  );
};
