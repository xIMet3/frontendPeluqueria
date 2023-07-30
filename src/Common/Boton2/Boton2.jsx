import React from "react";
import "./Boton2.css";
import { useNavigate } from "react-router-dom";


export const Boton2 = ({ path, name }) => {
    const navigate = useNavigate();

    return (
        <div className="boton2Diseño" onClick={() => navigate(path)}>
            {name}

        </div>
    )
}