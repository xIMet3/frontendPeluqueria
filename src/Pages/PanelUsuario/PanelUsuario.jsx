import React, { useState, useEffect } from "react";
import "./PanelUsuario.css";
import { CardUsuario } from "../../Common/CardUsuario/CardUsuario";
import { useSelector } from "react-redux";
import { cogerUserData, modificarUsuario } from "../../../Services/apiCalls";

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

  // Obtiene las credenciales del usuario desde el estado global
  const { credentials = {} } = useSelector((state) => state.user);

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

  // Funcion para abrir el modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Funcion para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Funcion para manejar los cambios en los campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funcion para guardar los cambios del usuario
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
  return (
    <div className="panelUsuarioEntero">
      <div className="parteIzquierda">
        <div className="cardUsuario">
          {/* Pasar el usuario y la función para abrir el modal como prop */}
          <CardUsuario user={user} handleOpenModal={handleOpenModal} />
        </div>
      </div>
      <div className="parteDerecha"></div>

      {/* Renderiza el modal si showModal es true */}
      {showModal && (
        // Agregar la clase modalUsuario aquí para aplicar los estilos de superposición
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
