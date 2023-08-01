import React, { useState, useEffect } from "react";
import "./PanelUsuario.css";
import { CardUsuario } from "../../Common/CardUsuario/CardUsuario";
import { useSelector } from "react-redux";
import { cogerUserData, modificarUsuario, verMisCitas } from "../../../Services/apiCalls";
import { modificarCancelarCita } from "../../../Services/apiCalls";

export const PanelUsuario = () => {
  const [usuario, setUsuario] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    codigo_postal: "",
    contraseña: "",
  });
  const [contraseñaError, setContraseñaError] = useState("");
  const [citasUsuario, setCitasUsuario] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const citasPorPagina = 6;

  const { credentials = {} } = useSelector((state) => state.usuario);

  useEffect(() => {
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

  const handleAbrirModal = () => {
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const handleCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const guardarCambios = async () => {
    try {
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

      await modificarUsuario(credentials.token, userDataToUpdate);

      setUsuario({
        ...usuario,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        codigo_postal: formData.codigo_postal,
      });

      handleCerrarModal();
    } catch (error) {
      console.error("Error al guardar los cambios: ", error);
    }
  };

  const handleVerMisCitas = async () => {
    try {
      const citas = await verMisCitas(credentials.token);
      setCitasUsuario(citas);
    } catch (error) {
      console.error("Error al obtener las citas del usuario: ", error);
    }
  };

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

  const citasPaginadas = () => {
    const indexOfLastCita = paginaActual * citasPorPagina;
    const indexOfFirstCita = indexOfLastCita - citasPorPagina;
    return citasUsuario.slice(indexOfFirstCita, indexOfLastCita);
  };

  const handleSiguientePagina = () => {
    setPaginaActual((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPaginaActual((prevPage) => prevPage - 1);
  };

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
          <CardUsuario usuario={usuario} handleAbrirModal={handleAbrirModal} handleVerMisCitas={handleVerMisCitas} />
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
                {cita.Cita_estado.nombre_cita_estado === "Pendiente" && (
                  <div className="botonCancelarCita">
                    <button onClick={() => cancelarCita(cita.id)}>Cancelar</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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
