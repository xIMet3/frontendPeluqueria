import React from "react";
import { Carousel } from "react-bootstrap";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Importa las imágenes
import imagen1 from "../../../img/carrusel1.png";
import imagen2 from "../../../img/carrusel2.png";
import imagen3 from "../../../img/carrusel3.png";
import imagen4 from "../../../img/carrusel4.png";
import imagen5 from "../../../img/carrusel5.png";
import imagen6 from "../../../img/johnsonExclusiveYellow.jpeg";

const imagenes = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6];

export const Home = () => {
  return (
    <div className="homeEntera">
      <Carousel id="carrusel">
        {imagenes.map((image, index) => (
          <Carousel.Item key={index}>
            <div className="imagen-contenedor">
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};
