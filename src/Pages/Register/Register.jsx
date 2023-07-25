import React from "react";
import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";


export const Register = () => {
  const [usuario, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    codigo_postal: "",
    contraseña: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputHandler = ({ target }) => {
    let { nombre, value } = target;
    setUser((prevState) => ({
      ...prevState,
      [nombre]: value,
    }));
  };

  return (
    <>
      <Container id="registerEntera">
        <Row className="formularioRegister justify-content-center m-5">
          <Col xs={10} md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicNombre">
                <Form.Label className="fw-bold">Nombre</Form.Label>
                <Form.Control
                  type="name"
                  name="name"
                  placeholder="Introduce tu nombre"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicApellidos">
                <Form.Label className="fw-bold">Apellidos</Form.Label>
                <Form.Control
                  type="surname"
                  name="apellido"
                  placeholder="Introduce tus apellidos"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Introduce tu email"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicTelefono">
                <Form.Label className="fw-bold">Teléfono</Form.Label>
                <Form.Control
                  type="phone"
                  name="telefono"
                  placeholder="Introduce tu número de teléfono"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPostal">
                <Form.Label className="fw-bold">Código postal</Form.Label>
                <Form.Control
                  type="name"
                  name="codigoPostal"
                  placeholder="Introduce tu código postal"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className="fw-bold">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Introduce tu contraseña"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => {
                  submitHandler(e, user);
                }}
              >
                Enviar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};
