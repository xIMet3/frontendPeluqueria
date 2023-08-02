import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PanelUsuario.css";
import { CardUsuario } from "../../Common/CardUsuario/CardUsuario";
import { useSelector } from "react-redux";
import { cogerUserData, modificarUsuario, verMisCitas } from "../../../Services/apiCalls";
import { modificarCancelarCita } from "../../../Services/apiCalls";
import { useDispatch } from "react-redux";

export const PanelUsuario = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Estado local para almacenar los datos del usuario
  const [usuario, setUsuario] = useState({});
  // Estado local para controlar la visibilidad del modal de modificacion de datos
  const [showModal, setShowModal] = useState(false);
  // Estado local para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    codigo_postal: "",
    contraseña: "",
  });
  // Estado local para gestionar los errores de contraseña
  const [contraseñaError, setContraseñaError] = useState("");
  // Estado local para almacenar las citas del usuario
  const [citasUsuario, setCitasUsuario] = useState([]);
  // Estado local para controlar la paginacion de las citas
  const [paginaActual, setPaginaActual] = useState(1);
  // Constante para establecer el numero de citas por pagina
  const citasPorPagina = 6;

  // Obtener los datos de usuario desde la tienda Redux
  const { credentials = {} } = useSelector((state) => state.usuario);

  // Efecto de montaje del componente
  useEffect(() => {
    // Funcion asincronica para obtener los datos del usuario y establecer el estado local
    const verPerfilUsuario = async () => {
      try {
        const userData = await cogerUserData(credentials.token);
        setUsuario(userData.data);
        setFormData({
          nombre: userData.data?.nombre || "",
          apellido: userData.data?.apellido || "",
          email: userData.data?.email || "",
          telefono: userData.data?.telefono || "",
          codigo_postal: userData.data?.codigo_postal || "",
          contraseña: "",
        });
      } catch (error) {
        console.error("Error al obtener los datos del usuario: ", error);
      }
    };
    verPerfilUsuario();
  }, [credentials.token]);

  // Funcion para abrir el modal de modificacion de datos
  const handleAbrirModal = () => {
    setShowModal(true);
  };

  // Funcion para cerrar el modal de modificación de datos
  const handleCerrarModal = () => {
    setShowModal(false);
  };

  // Funcion para manejar el cambio de los campos del formulario
  const handleCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funcion para guardar los cambios realizados en el formulario
  const guardarCambios = async () => {
    try {
      // Objeto con los datos del usuario a modificar
      const userDataToUpdate = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        codigo_postal: formData.codigo_postal,
      };

      if (formData.contraseña && formData.contraseña.length >= 6) {
        userDataToUpdate.contraseña = formData.contraseña;
        setContraseñaError("");
      } else if (formData.contraseña && formData.contraseña.length < 6) {
        setContraseñaError("La contraseña debe tener al menos 6 caracteres");
        return;
      } else {
        setContraseñaError("Introduzca su contraseña o su nueva contraseña");
        return;
      }

      // Llamada a la API para modificar los datos del usuario
      await modificarUsuario(credentials.token, userDataToUpdate);

      // Actualizar el estado local con los nuevos datos del usuario
      setUsuario({
        ...usuario,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        codigo_postal: formData.codigo_postal,
      });

      // Cerrar el modal despues de guardar los cambios
      handleCerrarModal();
    } catch (error) {
      console.error("Error al guardar los cambios: ", error);
    }
  };

  // Funcion para obtener las citas del usuario
  const handleVerMisCitas = async () => {
    try {
      const citas = await verMisCitas(credentials.token);
      setCitasUsuario(citas);
    } catch (error) {
      console.error("Error al obtener las citas del usuario: ", error);
    }
  };

  // Funcion para formatear la fecha en formato local
  const formatoLocalFecha = (cita) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(cita.fecha).toLocaleString(undefined, options);
  };

  // Funcion para obtener las citas paginadas en la pagina actual
  const citasPaginadas = () => {
    const indexOfLastCita = paginaActual * citasPorPagina;
    const indexOfFirstCita = indexOfLastCita - citasPorPagina;
    return citasUsuario.slice(indexOfFirstCita, indexOfLastCita);
  };

  // Funcion para manejar el botón de siguiente página en la paginacion
  const handleSiguientePagina = () => {
    setPaginaActual((prevPage) => prevPage + 1);
  };

  // Funcion para manejar el botón de pagina previa en la paginacion
  const handlePaginaPrevia = () => {
    setPaginaActual((prevPage) => prevPage - 1);
  };

  // Funcion para cancelar una cita
  const cancelarCita = async (citaId) => {
    try {
      await modificarCancelarCita(credentials.token, citaId);
      await handleVerMisCitas();
    } catch (error) {
      console.error("Error al cancelar la cita: ", error);
    }
  };

  return (
    <div className="panelUsuarioEntero">
      <div className="parteIzquierda">
        <div className="cardUsuario">
          {/* Componente CardUsuario para mostrar los datos del usuario */}
          <CardUsuario
            usuario={usuario}
            handleAbrirModal={handleAbrirModal}
            handleVerMisCitas={handleVerMisCitas}
          />
        </div>
      </div>
      <div className="parteDerecha">
        <h2>Mis Citas</h2>
        <div className="citasContainer">
          {citasPaginadas().map((cita) => (
            <div key={cita.id} className="citaItem">
              <div className="citaItemInfo">
                <p>
                  <strong>{formatoLocalFecha(cita)}</strong>
                </p>
                <p>
                  <strong>Servicio:</strong> {cita.Servicio.nombre_servicio}
                </p>
                <p>
                  <strong>Empleado:</strong> {cita.Empleado.nombre}
                </p>
                <p>
                  <strong>Precio:</strong> {cita.Servicio.precio_servicio}
                </p>
                <div className="citaItemComentario">
                  <p>
                    <strong>Comentario:</strong> {cita.comentario}
                  </p>
                </div>
                {/* Mostrar el estado de la cita */}
                <p
                  className={`estadoCita ${
                    cita.Cita_estado.nombre_cita_estado === "Pendiente"
                      ? "estadoPendiente"
                      : cita.Cita_estado.nombre_cita_estado === "Cancelada"
                      ? "estadoCancelada"
                      : "estadoRealizada"
                  }`}
                >
                  {cita.Cita_estado.nombre_cita_estado}
                </p>
                {/* Mostrar botón para cancelar cita si está pendiente */}
                {cita.Cita_estado.nombre_cita_estado === "Pendiente" && (
                  <div className="botonCancelarCita">
                    <button onClick={() => cancelarCita(cita.id)}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Mostrar botones de paginacion si hay mas citas que el numero de citas por pagina */}
        {citasUsuario.length > citasPorPagina && (
          <div className="paginationButtons">
            {paginaActual > 1 && (
              <button onClick={handlePaginaPrevia}>Anterior</button>
            )}
            {paginaActual < Math.ceil(citasUsuario.length / citasPorPagina) && (
              <button onClick={handleSiguientePagina}>Siguiente</button>
            )}
          </div>
        )}
      </div>
      {/* Mostrar el modal para modificar los datos del usuario */}
      {showModal && (
        <div className="modalUsuario">
          <div className="modal-contenido">
            <span className="cerrar" onClick={handleCerrarModal}>
              &times;
            </span>
            <h2>Modificar Datos</h2>
            <form>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleCambio}
              />
              <label>Apellidos:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleCambio}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleCambio}
              />
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleCambio}
              />
              <label>Código Postal:</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleCambio}
              />
              <label>Contraseña:</label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleCambio}
              />
              {/* Mostrar mensaje de error si hay un problema con la contraseña */}
              {contraseñaError && (
                <p className="error-message">{contraseñaError}</p>
              )}
              <button type="button" onClick={guardarCambios}>
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};