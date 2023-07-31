import React, { useEffect, useState } from "react";
import "./PanelAdmin.css";
import { todosLosUsuarios, eliminarUsuario } from "../../../Services/apiCalls";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const PanelAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const token = useSelector((state) => state.usuario.credentials.token);
  const navigate = useNavigate();

  useEffect(() => {
    // Llamada a la API para obtener los usuarios
    const obtenerUsuarios = async () => {
      try {
        // Obtener los usuarios registrados
        const response = await todosLosUsuarios(token);

        // Verificar si la respuesta es exitosa y si contiene la propiedad "data"
        if (response.success) {
          setUsuarios(response.data);
        } else {
          console.error("La respuesta de todosLosUsuarios no es válida:", response);
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    obtenerUsuarios();
  }, [token]);

  const handleEliminarUsuario = async (usuarioId) => {
    try {
      // Llamada a la API para eliminar el usuario con el ID proporcionado
      const response = await eliminarUsuario(usuarioId, token);
      if (response.success) {
        // Si se eliminó exitosamente, actualizamos la lista de usuarios
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== usuarioId));
      } else {
        console.error("Error al eliminar el usuario:", response);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleVerTodasLasCitas = () => {
    navigate("/panelEmpleado");
  };

  const handleFiltrarPorNombre = (e) => {
    setFiltroNombre(e.target.value);
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <div className="panelAdminEntero">
      <h1>Todos los usuarios registrados</h1>
      <div>
        <input
          type="text"
          placeholder="Filtrar por nombre..."
          value={filtroNombre}
          onChange={handleFiltrarPorNombre}
        />
        <button id="verCitasAdmin" onClick={handleVerTodasLasCitas}>Ver todas las citas</button>
      </div>
      <div className="panelAdminTablaContainer">
        <table className="panelAdminTabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Código Postal</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.codigo_postal}</td>
                <td>
                  <button id="botonEliminarUsuario" onClick={() => handleEliminarUsuario(usuario.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
