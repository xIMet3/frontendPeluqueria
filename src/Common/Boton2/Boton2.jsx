import React from "react";
import "./Boton2.css";
import { useNavigate } from "react-router-dom";

export const Boton2 = ({ path, name, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(path);
  };

  return (
    <div className="boton2Diseño" onClick={handleClick}>
      {name}
    </div>
  );
};
