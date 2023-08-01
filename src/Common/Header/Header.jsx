import React, { useState } from "react";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Boton1 } from "../Boton1/Boton1";
import { Boton2 } from "../Boton2/Boton2";
import jwtDecode from "jwt-decode";
import { userData, logout } from "../../Pages/userSlice";
import { useEffect } from "react";

export const Header = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(userData);
  const navigate = useNavigate();
  const isLogeado = !!usuario.credentials.token;
  const nombreUsuario = isLogeado ? `Hola, ${usuario.data.nombre}` : null;
  const rolUsuario = isLogeado
    ? jwtDecode(usuario.credentials.token).rolId
    : null;

  const handleLogout = () => {
    // Llama a la accion de logout para limpiar los datos de usuario en el estado
    dispatch(logout());
    navigate("/login");
  };
  useEffect(() => {
    // Redirige a la página de Login despues de cerrar sesion
    if (!isLogeado) {
      navigate("/login");
    }
  }, [isLogeado]);

  const handleUserButtonClick = () => {
    // Permite redirigir al panel del usuario solo si esta logeado
    if (isLogeado) {
      navigate("/panelUsuario");
    }
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
            {/* Mostrar boton de Panel de Empleado si el rol es 1 o 2 */}
            {(rolUsuario === 1 || rolUsuario === 2) && (
              <Nav.Link className="text-light">
                <Boton2 path={"/panelEmpleado"} name={"Panel de Empleado"} />
              </Nav.Link>
            )}
            {/* Mostrar boton de Concertar Cita */}
            {isLogeado && (
              <Nav.Link className="text-light">
                <Boton2 path={"/concertarCita"} name={"Concertar cita"} />
              </Nav.Link>
            )}
            {/* Mostrar boton de Servicios */}
            <Nav.Link className="text-light">
              <Boton2 path={"/servicios"} name={"Servicios"} />
            </Nav.Link>
            {/* Mostrar botón de Panel de Admin solo si el rol es 1 */}
            {rolUsuario === 1 && (
              <Nav.Link className="text-light">
                <Boton2 path={"/panelAdmin"} name={"Panel de Admin"} />
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {/* Mostrar boton de Iniciar Sesion o Nombre de usuario */}
            {isLogeado ? (
              <Nav.Link className="text-light" onClick={handleUserButtonClick}>
                <Boton2
                  path={"/panelUsuario"}
                  name={nombreUsuario}
                  className="nombreNavbar"
                />
              </Nav.Link>
            ) : (
              <Nav.Link className="text-light">
                <Boton2 path={"/login"} name={"Iniciar sesión"} />
              </Nav.Link>
            )}

            {/* Mostrar boton de Logout o Registrarse */}
            {isLogeado ? (
              <Nav.Link className="text-light">
                <Boton2 onClick={handleLogout} name={"Logout"} />
              </Nav.Link>
            ) : (
              <Nav.Link className="text-light">
                <Boton2 path={"/register"} name={"Regístrate"} />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
