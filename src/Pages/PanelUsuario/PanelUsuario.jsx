import React, { useState, useEffect } from "react";
import "./PanelUsuario.css"; // Importar el archivo CSS para estilizar el componente
import { CardUsuario } from "../../Common/CardUsuario/CardUsuario"; // Importar el componente CardUsuario
import { useSelector } from "react-redux"; // Importar el hook useSelector de Redux
import { cogerUserData, modificarUsuario, verMisCitas } from "../../../Services/apiCalls"; // Importar funciones para hacer llamadas a la API

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
  const [paginaActual, setPaginaActual] = useState(1);
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
  const handleAbrirModal = () => {
    setShowModal(true);
  };

  // Funcion para cerrar el modal de modificar usuario
  const handleCerrarModal = () => {
    setShowModal(false);
  };

  // Funcion para manejar los cambios en los campos del modal de modificar usuario
  const handleCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funcion para guardar los cambios del usuario en el modal de modificar usuario
  const guardarCambios = async () => {
    try {
      // Datos del usuario que se pueden actualizar
      const userDataToUpdate = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        codigo_postal: formData.codigo_postal,
      };

      // Valida la contraseña para que tenga al menos 6 caracteres
      if (formData.contraseña && formData.contraseña.length >= 6) {
        userDataToUpdate.contraseña = formData.contraseña;
        setContraseñaError(""); // Reinicia el mensaje de error
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
      handleCerrarModal();
    } catch (error) {
      console.error("Error al guardar los cambios: ", error);
    }
  };

  // Funcion para obtener las citas del usuario cuando se pulsa en el boton "Ver mis citas"
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

  // Funcion para formatear la fecha y hora en formato local
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

  // Funcion que devuelve las citas de la pagina actual
  const citasPaginadas = () => {
    const indexOfLastCita = paginaActual * citasPorPagina;
    const indexOfFirstCita = indexOfLastCita - citasPorPagina;
    return citasUsuario.slice(indexOfFirstCita, indexOfLastCita);
  };

  // Funcion para ir a la siguiente página de citas
  const handleSiguientePagina = () => {
    setPaginaActual((prevPage) => prevPage + 1);
  };

  // Funcion para ir a la pagina anterior de citas
  const handlePreviousPage = () => {
    setPaginaActual((prevPage) => prevPage - 1);
  };

  return (
    <div className="panelUsuarioEntero">
      {/* Parte izquierda: contiene la CardUsuario */}
      <div className="parteIzquierda">
        <div className="cardUsuario">
          <CardUsuario
            user={user}
            handleAbrirModal={handleAbrirModal}
            handleVerMisCitas={handleVerMisCitas}
          />
        </div>
      </div>
      {/* Parte derecha: contiene las citas del usuario */}
      <div className="parteDerecha">
        <h2>Mis Citas</h2>
        <div className="citasContainer">
          {/* Muestra las citas paginadas */}
          {citasPaginadas().map((cita) => (
            <div key={cita.id} className="citaItem">
              <div className="citaItemInfo">
                <p>{formatoLocalFecha(cita)}</p>
                <p>Servicio: {cita.Servicio.nombre_servicio}</p>
                <p>Precio: {cita.Servicio.precio_servicio}</p>
                <div className="citaItemComentario">
                  <p>
                    <strong>Comentario:</strong> {cita.comentario}
                  </p>
                </div>
                <p className="estadoCita">
                  Estado: {cita.Cita_estado.nombre_cita_estado}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Muestra botones de paginacion si hay mas citas que la cantidad por pagina */}
        {citasUsuario.length > citasPorPagina && (
          <div className="paginationButtons">
            {paginaActual > 1 && (
              <button onClick={handlePreviousPage}>Anterior</button>
            )}
            {paginaActual < Math.ceil(citasUsuario.length / citasPorPagina) && (
              <button onClick={handleSiguientePagina}>Siguiente</button>
            )}
          </div>
        )}
      </div>
      {/* Modal de modificar usuario */}
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
              {/* Muestra mensaje de error si la contraseña es invalida */}
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
