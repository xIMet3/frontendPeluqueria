import React from "react";
import "./PanelUsuario.css";
import { CardUsuario } from "../../Common/CardUsuario/CardUsuario";





export const PanelUsuario = () => {


    return (
        <div className="panelUsuarioEntero">
            <div className="parteIzquierda">
                <div className="cardUsuario">
                    <CardUsuario></CardUsuario>
                </div>
            </div>
            <div className="parteDerecha">
            </div>         
        </div>
    )
}