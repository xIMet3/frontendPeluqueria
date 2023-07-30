import React from "react";
import { useDispatch } from "react-redux";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Boton1 } from "../Boton1/Boton1";
import { Boton2 } from "../Boton2/Boton2";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Pages/userSlice";

export const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Llama a la acción de logout para limpiar los datos de usuario en el estado
    dispatch(logout());
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand>
          <Boton1 path={"/"} name={"Johnson Exclusive"} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="text-light">
              <Boton2 path={"/panelUsuario"} name={"Panel de usuario"} />
            </Nav.Link>
            <Nav.Link className="text-light">
              <Boton2 path={"/panelEmpleado"} name={"Panel de Empleado"} />
            </Nav.Link>
            <Nav.Link className="text-light">
              <Boton2 path={"/"} name={"Servicios"} />
            </Nav.Link>
            <Nav.Link className="text-light">
              <Boton2 path={"/concertarCita"} name={"Concertar cita"} />
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className="text-light">
              <Boton2 path={"/login"} name={"Iniciar sesión"} />
            </Nav.Link>
            <Nav.Link className="text-light">
              <Boton2 path={"/register"} name={"Regístrate"} />
            </Nav.Link>
            {/* Botón de Logout */}
            <Nav.Link className="text-light">
              <button onClick={handleLogout}>Logout</button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};


