import React from "react";
import "./Login.css";
import { login } from "../userSlice";
import { loginUsuario } from "../../../Services/apiCalls";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export const Login = () => {
  // Estado local para almacenar los datos del usuario (email y contraseña)
  const [usuario, setUsuario] = useState({
    email: "",
    contraseña: "",
  });

  // Obtenemos la funcion "dispatch" de Redux para enviar acciones al store
  const dispatch = useDispatch();
  // Hook para redireccionar a otras rutas
  const navigate = useNavigate();

  // Funcion para manejar los cambios en los campos del formulario
  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funcion para manejar el envio del formulario
  const submitHandler = (e, body) => {
    e.preventDefault();
    // Llamar a la funcion 'loginUsuario' para enviar los datos del usuario al backend
    loginUsuario(body).then((res) => {
      // Decodificar el token JWT recibido desde el backend
      let decoded = jwtDecode(res);
      // Utilizar el action 'login' del slice 'userSlice' para almacenar el token y datos del usuario en el estado global
      dispatch(
        login({
          token: res,
          nombre: decoded.nombre,
          rol_id: decoded.rol_id,
        })
      );
      // Redirige a la pagina de inicio despues del inicio de sesion
      navigate("/");
    });
  };

  return (
    <>
      <Container className="loginEntero">
        <Row className="formularioLogin justify-content-center m-5">
          <Col xs={10} md={6} className="">
            <Form className="h-100 d-flex flex-column align-items-center justify-content-center">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label id="email">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Introduce email"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label id="contraseña">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña"
                  placeholder="Introduce contraseña"
                  onChange={(e) => {
                    inputHandler(e);
                  }}
                />
              </Form.Group>
              <Button
                id="boton"
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

export default Login;
