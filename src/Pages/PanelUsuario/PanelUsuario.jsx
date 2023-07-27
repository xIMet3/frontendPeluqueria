import React, { useState, useEffect } from "react";
import "./PanelUsuario.css";
import { CardUsuario } from "../../Common/CardUsuario/CardUsuario";
import { useSelector } from "react-redux";
import {
  cogerUserData,
  modificarUsuario,
  verMisCitas,
} from "../../../Services/apiCalls";

export const PanelUsuario = () => {
  // Estado que almacena los datos del usuario
  const [user, setUsuario] = useState({});
  // Estado que controla la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado que almacena los datos del formulario del modal
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    codigo_postal: "",
    contraseña: "",
  });
  // Estado que controla el mensaje de error para el campo de contraseña
  const [contraseñaError, setContraseñaError] = useState("");
  // Estado que almacena las citas del usuario
  const [citasUsuario, setCitasUsuario] = useState([]);
  // Estado que almacena el número de página actual
  const [currentPage, setCurrentPage] = useState(1);
  // Constante que define la cantidad de citas por página
  const citasPorPagina = 6;

  // Obtiene las credenciales del usuario desde el estado global
  const { credentials = {} } = useSelector((state) => state.usuario);

  // Carga los datos del usuario cuando el componente se monta o las credenciales cambian
  useEffect(() => {
    const verPerfilUsuario = async () => {
      try {
        // Llama a la API para obtener los datos del usuario
        const userData = await cogerUserData(credentials.token);
        // Actualiza el estado con los datos del usuario
        setUsuario(userData.data);
        // Establece los valores iniciales del formulario del modal con los datos del usuario
        setFormData({
          nombre: userData.data?.nombre || "",
          apellido: userData.data?.apellido || "",
          email: userData.data?.email || "",
          telefono: userData.data?.telefono || "",
          codigo_postal: userData.data?.codigo_postal || "",
          contraseña: "", // No mostrar la contraseña actual en el formulario
        });
      } catch (error) {
        console.error("Error al obtener los datos del usuario: ", error);
      }
    };
    verPerfilUsuario();
  }, [credentials.token]);

  // Funcion para abrir el modal de modificar usuario
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Funcion para cerrar el modal de modificar usuario
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Funcion para manejar los cambios en los campos del modal de modificar usuario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funcion para guardar los cambios del usuario en el modal de modificar usuario
  const handleSaveChanges = async () => {
    try {
      // Datos del usuario que se pueden actualizar
      const userDataToUpdate = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        codigo_postal: formData.codigo_postal,
      };

      // Validamos la contraseña para que tenga al menos 6 caracteres
      if (formData.contraseña && formData.contraseña.length >= 6) {
        userDataToUpdate.contraseña = formData.contraseña;
        setContraseñaError(""); // Reiniciamos el mensaje de error
      } else if (formData.contraseña && formData.contraseña.length < 6) {
        setContraseñaError("La contraseña debe tener al menos 6 caracteres");
        return;
      } else {
        setContraseñaError("Introduzca su contraseña o su nueva contraseña");
        return;
      }

      // Llama a la API para actualizar los datos del usuario
      await modificarUsuario(credentials.token, userDataToUpdate);

      // Actualiza los datos del usuario en el estado con los nuevos valores
      setUsuario({
        ...user,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        codigo_postal: formData.codigo_postal,
      });

      // Cerrar el modal
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar los cambios: ", error);
    }
  };

  // Funcion para obtener las citas del usuario cuando se hace clic en el botón "Ver mis citas"
  const handleVerMisCitas = async () => {
    try {
      // Llama a la API para obtener las citas del usuario
      const citas = await verMisCitas(credentials.token);
      // Actualiza el estado con las citas del usuario
      setCitasUsuario(citas);
    } catch (error) {
      console.error("Error al obtener las citas del usuario: ", error);
    }
  };

  // Función para formatear la fecha y hora en formato local
  const formatLocalDateTime = (cita) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };
    return new Date(cita.fecha).toLocaleString(undefined, options);
  };

  // Función para obtener las citas que deben mostrarse en la página actual
  const citasPaginadas = () => {
    const indexOfLastCita = currentPage * citasPorPagina;
    const indexOfFirstCita = indexOfLastCita - citasPorPagina;
    return citasUsuario.slice(indexOfFirstCita, indexOfLastCita);
  };

  // Función para cambiar a la página siguiente
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Función para cambiar a la página anterior
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="panelUsuarioEntero">
      <div className="parteIzquierda">
        <div className="cardUsuario">
          {/* Pasar el usuario y las funciones para abrir el modal y ver las citas como props */}
          <CardUsuario
            user={user}
            handleOpenModal={handleOpenModal}
            handleVerMisCitas={handleVerMisCitas} // Pasamos la función para ver las citas
          />
        </div>
      </div>
      <div className="parteDerecha">
        {/* Renderizamos las citas del usuario */}
        <h2>Mis Citas</h2>
        <div className="citasContainer">
          {citasPaginadas().length > 0 ? (
            citasPaginadas().map((cita) => (
              <div key={cita.id} className="citaItem">
                <div className="citaItemInfo">
                  <p>{formatLocalDateTime(cita)}</p>
                  <p>Servicio: {cita.Servicio.nombre_servicio}</p>
                  <p>Precio: {cita.Servicio.precio_servicio}</p>
                <div className="citaItemComentario">
                  <p><strong>Comentario:</strong> {cita.comentario}</p>
                </div>
                  <p className="estadoCita">Estado: {cita.Cita_estado.nombre_cita_estado}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay citas disponibles.</p>
          )}
        </div>
        {/* Renderizar botones de paginación */}
        {citasUsuario.length > citasPorPagina && (
          <div className="paginationButtons">
            {currentPage > 1 && (
              <button onClick={handlePreviousPage}>Anterior</button>
            )}
            {currentPage < Math.ceil(citasUsuario.length / citasPorPagina) && (
              <button onClick={handleNextPage}>Siguiente</button>
            )}
          </div>
        )}
      </div>

      {/* Renderiza el modal de modificar usuario si showModal es true */}
      {showModal && (
        <div className="modalUsuario">
          <div className="modal-contenido">
            <span className="cerrar" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Modificar Datos</h2>
            <form>
              {/* Campos del formulario del modal */}
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
              <label>Apellidos:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
              <label>Código Postal:</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
              />
              <label>Contraseña:</label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
              />
              {/* Mensaje de error para el campo de contraseña */}
              {contraseñaError && (
                <p className="error-message">{contraseñaError}</p>
              )}
              {/* Boton para guardar los cambios */}
              <button type="button" onClick={handleSaveChanges}>
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
