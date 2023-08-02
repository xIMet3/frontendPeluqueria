import React from "react";
import "./Register.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { registroUsuario } from "../../../Services/apiCalls";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  // Estado local para almacenar los datos del usuario
  const initialState = {
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    codigo_postal: "",
    contraseña: "",
  };
  // Utiliza el estado "usuario" y la función "setUser" para actualizarlo
  const [usuario, setUser] = useState(initialState);
  // Hook  para redireccionar a otras rutas
  const navigate = useNavigate();

  // Funcion para manejar los cambios en los campos del formulario
  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funcion para manejar el envio del formulario
  const submitHandler = async (e) => {
    e.preventDefault();
    // Valida el numero de telefono antes de enviarlo al backend
    if (usuario.telefono.length !== 9) {
      alert("Porfavor, introduce un número de telefono válido (9 digitos)");
      return;
    }
    try {
      // Llamar a la funcion 'registroUsuario' para enviar los datos del usuario al backend
      const res = await registroUsuario(usuario);
      console.log(res);
      // Limpia el formulario despues del registro
      setUser(initialState);
      // Redirige a la página de inicio de sesion
      navigate("/login");
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error("Error al registrar el usuario:", error);
    }
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
                  name="nombre"
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
                  type="text"
                  name="codigo_postal"
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
                  name="contraseña"
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
                  submitHandler(e, usuario);
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