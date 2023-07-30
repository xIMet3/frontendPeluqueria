// Header.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Boton1 } from "../Boton1/Boton1";
import { Boton2 } from "../Boton2/Boton2";
import jwtDecode from "jwt-decode";
import { userData, logout } from "../../Pages/userSlice";

export const Header = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(userData);
  console.log("Estado de Redux:", usuario);
  const isLogeado = !!usuario.credentials.token;
  const userName = isLogeado ? jwtDecode(usuario.credentials.token).nombre : null;
  const rolUsuario = isLogeado ? jwtDecode(usuario.credentials.token).rolId : null;
  console.log("rolUsuario:", rolUsuario);

  const handleLogout = () => {
    // Llama a la acción de logout para limpiar los datos de usuario en el estado
    dispatch(logout());
  };

  const handleUserButtonClick = () => {
    // Redirige al panel del usuario solo si está logeado
    if (isLogeado) {
      window.location.href = "/panelUsuario";
    }
  };

  const handleCitaButtonClick = () => {
    // Redirige a la página para concertar cita solo si está logeado
    if (isLogeado) {
      window.location.href = "/concertarCita";
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
            {/* Mostrar botón de Panel de Usuario */}
            {isLogeado && (
              <Nav.Link className="text-light">
                <Boton2 path={"/panelUsuario"} name={"Panel de usuario"} />
              </Nav.Link>
            )}
            {/* Mostrar botón de Panel de Empleado si el rol es 1 o 2 */}
            {(rolUsuario === 1 || rolUsuario === 2) && (
              <Nav.Link className="text-light">
                <Boton2 path={"/panelEmpleado"} name={"Panel de Empleado"} />
              </Nav.Link>
            )}
            <Nav.Link className="text-light">
              <Boton2 path={"/"} name={"Servicios"} />
            </Nav.Link>
            {/* Mostrar botón de Concertar Cita */}
            {isLogeado && (
              <Nav.Link className="text-light">
                <Boton2 path={"/concertarCita"} name={"Concertar cita"} />
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {/* Mostrar botón de Iniciar Sesión o Nombre de usuario */}
            {isLogeado ? (
              <Nav.Link className="text-light" onClick={handleUserButtonClick}>
                <Boton2 path={"/panelUsuario"} name={userName} />
              </Nav.Link>
            ) : (
              <Nav.Link className="text-light">
                <Boton2 path={"/login"} name={"Iniciar sesión"} />
              </Nav.Link>
            )}

            {/* Mostrar botón de Logout o Registrarse */}
            {isLogeado ? (
              <Nav.Link className="text-light">
                <button onClick={handleLogout}>Logout</button>
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
