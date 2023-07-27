import React from "react";
import "./CardUsuario.css";

export const CardUsuario = ({ user, handleAbrirModal, handleVerMisCitas }) => {
  return (
    <div className="cardCustom d-flex justify-content-center">
      <div className="card" id="card">
        <img src="../../../img/iconoUsuario.png" className="card-img-top" />
        <div className="card-body">
          <h5 className="card-titulo">
            <strong>Nombre:</strong> {user?.nombre}
          </h5>
          <ul className="lista-grupo">
            <li className="lista-grupo-objeto">
              <strong>Apellidos:</strong> {user?.apellido}
            </li>
            <li className="lista-grupo-objeto">
              <strong>Email:</strong> {user?.email}
            </li>
            <li className="lista-grupo-objeto">
              <strong>Teléfono:</strong> {user?.telefono}
            </li>
            <li className="lista-grupo-objeto">
              <strong>Código Postal:</strong> {user?.codigo_postal}
            </li>
          </ul>
          <button className="btn btn-primary" onClick={handleAbrirModal}>
            Modificar
          </button>
          <div className="botones-container">
            {/* Agregamos el evento de clic al botón "Ver Mis Citas" */}
            <button className="btn btn-info" onClick={handleVerMisCitas}>
              Ver Mis Citas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
