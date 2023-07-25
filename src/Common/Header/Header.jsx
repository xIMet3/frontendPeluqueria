import React from "react";
import "./Header.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Boton1 } from "../Boton1/Boton1";
import { Boton2 } from "../Boton2/Boton2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";



export const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-dark navbar-dark">
  <Container>
    <Navbar.Brand >
      <Boton1 path={"/"} name={"Johnson Exclusive"} />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link className="text-light">
          <Boton2 path={"/"} name={"Features"} />
        </Nav.Link>
        <Nav.Link className="text-light">
          <Boton2 path={"/"} name={"Pricing"} />
        </Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link className="text-light">
          <Boton2 path={"/login"} name={"Iniciar sesión"} />
        </Nav.Link>
        <Nav.Link className="text-light">
          <Boton2 path={"/register"} name={"Regístrate"} />
        </Nav.Link>
        {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown> */}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  )
}

