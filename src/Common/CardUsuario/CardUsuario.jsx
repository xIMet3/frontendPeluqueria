import React from "react";
import "./CardUsuario.css";

export const CardUsuario = ({ user }) => {
    return (
        <div className="d-flex justify-content-center">
            <div className="card">
                <img src="../../../img/iconoUsuario.png" className="card-img-top" />
                <div className="card-body">
                    <h5 className="card-title"><strong>Nombre:</strong> {user?.nombre} </h5>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>Apellidos:</strong> {user?.apellido}</li>
                        <li className="list-group-item"><strong>Email:</strong> {user?.email}</li>
                        <li className="list-group-item"><strong>Teléfono:</strong> {user?.telefono}</li>
                        <li className="list-group-item"><strong>Código Postal:</strong> {user?.codigo_postal}</li>
                    </ul>
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
