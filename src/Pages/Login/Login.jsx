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
  const [usuario, setUsuario] = useState({
    email: "",
    contraseña: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputHandler = ({ target }) => {
    let { name, value } = target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler = (e, body) => {
    e.preventDefault();
    loginUsuario(body).then((res) => {
      let decoded = jwtDecode(res);
      dispatch(
        login({
          token: res,
          nombre: decoded.nombre,
          rol_id: decoded.rolId,
        })
      );
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
              <Button id="boton"
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
