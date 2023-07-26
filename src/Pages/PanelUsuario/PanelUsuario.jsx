import React, { useState, useEffect } from "react";
import "./PanelUsuario.css";
import { CardUsuario } from "../../Common/CardUsuario/CardUsuario";
import { useSelector } from "react-redux";
import { cogerUserData } from "../../../Services/apiCalls";

export const PanelUsuario = () => {
    const [user, setUsuario] = useState({}); // Inicializamos el estado con un objeto vacío
    const { credentials = {} } = useSelector((state) => state.user);

    useEffect(() => {
        const verPerfilUsuario = async () => {
            try {
                const userData = await cogerUserData(credentials.token);
                setUsuario(userData.data); // Pasamos userData.data como el objeto user
                console.log(userData)
            } catch (error) {
                console.error("Error al obtener los datos del usuario: ", error);
            }
        };
        verPerfilUsuario();
    }, [credentials.token]);

    return (
        <div className="panelUsuarioEntero">
            <div className="parteIzquierda">
                <div className="cardUsuario">
                    <CardUsuario user={user} /> {/* Pasar el objeto user como prop */}
                </div>
            </div>
            <div className="parteDerecha">
            </div>         
        </div>
    );
};
