import React from "react";
import "./Boton1.css";
import { useNavigate } from "react-router-dom";

export const Boton1 = ({ path, name }) => {
    const navigate = useNavigate();

    return (
        <div className="boton1Diseño" onClick={() => navigate(path)}>
            {name}

        </div>
    )
}