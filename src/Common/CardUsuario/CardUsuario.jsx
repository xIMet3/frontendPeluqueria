import React from "react";
import "./CardUsuario.css";

 export const CardUsuario = ({ usuario }) => {
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        src={usuario.icono}
        className="card-img-top"
        alt="Icono de usuario"
        style={{ width: "256px", height: "256px" }}
      />
      <div className="card-body">
        <h5 className="card-title">{usuario.nombre} {usuario.apellido}</h5>
        <p className="card-text">Email: {usuario.email}</p>
        <p className="card-text">Teléfono: {usuario.telefono}</p>
        <p className="card-text">Código Postal: {usuario.codigoPostal}</p>
        <button className="btn btn-primary">Botón</button>
      </div>
    </div>
  );
};