import React from "react";
import "./Header.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';



export const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-dark navbar-dark">
  <Container>
    <Navbar.Brand href="#home" className="text-light">React-Bootstrap</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="#features" className="text-light">Features</Nav.Link>
        <Nav.Link href="#pricing" className="text-light">Pricing</Nav.Link>
        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav>
        <Nav.Link href="#deets" className="text-light">More deets</Nav.Link>
        <Nav.Link eventKey={2} href="#memes" className="text-light">Dank memes</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  )
}

