import React from "react";
import "./CardUsuario.css";

export const CardUsuario = ({ usuario }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className="card">
        <img
          src="../../../img/iconoUsuario.png"
          className="card-img-top"
        />
        <div className="card-body">
          <h5 className="card-title">Nombre y Apellidos:</h5>
          <p className="card-text">Email: </p>
          <p className="card-text">Teléfono: </p>
          <p className="card-text">Código Postal: </p>
          <button className="btn btn-primary">Modificar</button>
        </div>
      </div>
    </div>
  );
};

// {usuario.nombre} {usuario.apellido}
// {usuario.email}
// {usuario.telefono}
// {usuario.codigo_postal}
