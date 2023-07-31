import React, { useEffect, useState } from "react";
import "./PanelAdmin.css";
import { todosLosUsuarios } from "../../../Services/apiCalls";
import { useSelector } from "react-redux";

export const PanelAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const token = useSelector((state) => state.usuario.credentials.token);

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

  const handleEliminarUsuario = (usuarioId) => {
    // Aquí puedes agregar la lógica para eliminar el usuario con el ID proporcionado
    // Por ejemplo, puedes llamar a una función de la API para eliminar el usuario
    console.log("Eliminar usuario con ID:", usuarioId);
  };

  return (
    <div className="panelAdminEntero">
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
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.nombre} {usuario.apellido}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.codigo_postal}</td>
              <td>
                <button id="botonEliminarUsuario"  onClick={() => handleEliminarUsuario(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
