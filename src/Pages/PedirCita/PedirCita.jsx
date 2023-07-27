import React, { useState, useEffect } from "react";
import "./PedirCita.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { crearCita, mostrarEmpleados, mostrarServicios } from "../../../Services/apiCalls";
import { userData } from "../userSlice";
import { Button, Form } from "react-bootstrap";

export const PedirCita = () => {
  // Obtiene las credenciales del usuario
  const { credentials } = useSelector(userData);

  // Estado para almacenar los datos del formulario
  const [body, setBody] = useState({});

  // Estado para manejar errores en el formulario
  const [error, setError] = useState("");

  // Estado para mostrar el mensaje de éxito
  const [successMessage, setSuccessMessage] = useState("");

  // Estado para mostrar le mensaje de no hay citas disponibles
  const [citasNoDisponibles, setCitasNoDisponibles] = useState(false);

  // Estado para almacenar las citas existentes
  const [citas, setCitas] = useState([]);

  // Estado para almacenar la lista de empleados
  const [empleados, setEmpleados] = useState([]);

  // Estado para almacenar la lista de servicios
  const [servicios, setServicios] = useState([]);

  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Hook de enrutamiento para redireccionar después de enviar el formulario
  const navigate = useNavigate();

  // Función para manejar el cambio de valor en los campos del formulario
  const inputHandler = ({ target }) => {
    let { name, value } = target;
    setBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para cargar la lista de empleados al montar el componente
  const obtenerEmpleados = async () => {
    try {
      const responseEmpleados = await mostrarEmpleados();
      setEmpleados(responseEmpleados.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para cargar la lista de servicios al montar el componente
  const obtenerServicios = async () => {
    try {
      const responseServicios = await mostrarServicios();
      setServicios(responseServicios.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviamos los datos del formulario al backend para crear la cita
      const res = await crearCita(credentials.token, body);

      if (res.success) {
        // La cita fue creada exitosamente
        setSuccessMessage("Su cita ha sido concertada con éxito");
        console.log(successMessage)
        setTimeout(() => {
          navigate("/panelUsuario");
        }, 1500);
      } else {
        // Ocurrió un error al crear la cita, mostramos el mensaje de error
        setError("Error al crear la cita");
      }
    } catch (error) {
      console.log(error);
      setError("Error al crear la cita");
    }
  };

  // Cargar la lista de empleados y servicios al montar el componente
  useEffect(() => {
    obtenerEmpleados();
    obtenerServicios();
  }, []);

  return (
    <div className="pedirCitaEntera">
      <div className="formularioCita">
      {successMessage && <div className="success-message">{successMessage}</div>}
        <h1>Concertar una Cita</h1>
        <Form onSubmit={handleSubmit} id="formularioInputs">
          {/* Espacio para la imagen */}
          <div className="imagenFija" />

          {/* Input para elegir fecha y hora */}
          <Form.Group id="inputFecha">
            <Form.Label><strong>Fecha y hora</strong></Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha"
              onChange={inputHandler}
            />
          </Form.Group>

          {/* Input para elegir empleado */}
          <Form.Group id="inputEmpleado">
            <Form.Label><strong>Empleado</strong></Form.Label>
            <Form.Control as="select" name="empleado_id" onChange={inputHandler}>
              <option value="">Selecciona un empleado</option>
              {empleados && empleados.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>{empleado.nombre}</option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Input para elegir servicio */}
          <Form.Group id="inputServicio">
            <Form.Label><strong>Servicio</strong></Form.Label>
            <Form.Control as="select" name="servicio_id" onChange={inputHandler}>
              <option value="">Selecciona un servicio</option>
              {servicios && servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre_servicio} - Precio: {servicio.precio_servicio}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Input para el comentario */}
          <Form.Group id="inputComentario">
            <Form.Label><strong>Comentario</strong></Form.Label>
            <Form.Control
              as="textarea"
              name="comentario"
              onChange={inputHandler}
            />
          </Form.Group>

          <Button type="submit" id="botonConcertarCita">Concertar Cita</Button>
        </Form>
      </div>
    </div>
  );
};




// const isAppointmentExist = appointments.find((appointment) => {
//     const appointmentDate = new Date(appointment.date);
//     return (
//       appointmentDate.getDate() === selectedDateTime.getDate() &&
//       appointmentDate.getMonth() === selectedDateTime.getMonth() &&
//       appointmentDate.getFullYear() === selectedDateTime.getFullYear() &&
//       appointmentDate.getHours() === selectedDateTime.getHours() &&
//       appointmentDate.getMinutes() === selectedDateTime.getMinutes()
//     );
//   });

//   if (isAppointmentExist) {
//     setError("Ya existe una cita en la fecha y hora especificadas.");
//     return;
//   }
