import React, { useState, useEffect } from "react";
import "./PedirCita.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { crearCita, mostrarEmpleados, mostrarServicios, todasLasCitas } from "../../../Services/apiCalls";
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

  // Estado para controlar si se ha seleccionado una hora valida
  const [horaValida, setHoraValida] = useState(true);

  // Estado para verificar si ya existe una cita reservada para la fecha y hora seleccionada
  const [citaExistente, setCitaExistente] = useState(false);

  // Hook de enrutamiento para redireccionar despues de enviar el formulario
  const navigate = useNavigate();

  // Funcion para manejar el cambio de valor en los campos del formulario
  const inputHandler = ({ target }) => {
    let { name, value } = target;
    setBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funcion para cargar la lista de empleados al montar el componente
  const obtenerEmpleados = async () => {
    try {
      const responseEmpleados = await mostrarEmpleados();
      setEmpleados(responseEmpleados.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para cargar la lista de servicios al montar el componente
  const obtenerServicios = async () => {
    try {
      const responseServicios = await mostrarServicios();
      setServicios(responseServicios.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para verificar si la fecha cumple con los requisitos
  const isFechaValida = (fecha) => {
    // Obtener el dia de la semana (0: Domingo, 1: Lunes, ..., 6: Sabado)
    const diaSemana = new Date(fecha).getDay();

    // Obtener la hora seleccionada
    const horaSeleccionada = new Date(fecha).getHours();

    // Validar el dia de la semana y la hora
    if (diaSemana >= 1 && diaSemana <= 6) {
      if (
        (horaSeleccionada >= 9 && horaSeleccionada < 13) ||
        (horaSeleccionada >= 16 && horaSeleccionada < 20)
      ) {
        // Verificar que los minutos sean 00 o 30 (tramos de 30 minutos)
        const minutosSeleccionados = new Date(fecha).getMinutes();
        return minutosSeleccionados === 0 || minutosSeleccionados === 30;
      }
    }

    return false;
  };

  // Funcion para verificar si ya existe una cita reservada para la fecha y hora seleccionada
  const isCitaExistente = async () => {
    try {
      const todasLasCitasRes = await todasLasCitas(credentials.token);
      const citasArray = Array.isArray(todasLasCitasRes)
        ? todasLasCitasRes
        : [];
      if (citasArray.length > 0) {
        const citaExistente = citasArray.find(
          (cita) => cita.fecha === body.fecha && cita.cita_estado_id !== 2
        );
        setCitaExistente(citaExistente !== undefined);
      } else {
        setCitaExistente(false); // No hay citas, entonces no existe una cita reservada
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para manejar el cambio de valor en el date picker
  const handleDateChange = (e) => {
    const fechaSeleccionada = e.target.value;
    const horaEsValida = isFechaValida(fechaSeleccionada);
    setHoraValida(horaEsValida);
    setBody((prevState) => ({
      ...prevState,
      fecha: fechaSeleccionada,
    }));
  };

  // Funcion para manejar el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si la fecha es valida antes de enviar el formulario
    if (!isFechaValida(body.fecha)) {
      setError(
        "La cita debe ser en tramos de 30 minutos, de 9:00 a 13:00 y de 16:00 a 20:00 de lunes a sábado."
      );
      return;
    }

    try {
      // Verificar si la cita ya existe antes de intentar crearla
      const citaExistente = await isCitaExistente();
      if (citaExistente) {
        setError("Ya hay una cita reservada en esa fecha y hora.");
        return;
      }

      // Si no hay errores, intentar crear la cita
      setError(""); // Limpia el mensaje de error anterior si existe
      crearCita(credentials.token, body)
        .then((res) => {
          if (res.success) {
            setSuccessMessage("Su cita ha sido creada con éxito");
            setTimeout(() => {
              // Limpia el mensaje despues de un tiempo para que desaparezca
              setSuccessMessage(""); 
              navigate("/panelUsuario");
            }, 1500);
          } else {
            setError("No se pudo reservar la cita");
          }
        })
        .catch((error) => {
          console.log(error);
          setError("No hay cita disponible a esa hora");
        });
    } catch (error) {
      console.log(error);
      setError("No hay cita disponible a esa hora");
    }
  };

  // Cargar la lista de empleados y servicios al montar el componente
  useEffect(() => {
    obtenerEmpleados();
    obtenerServicios();
  }, []);

  // Funcion para ocultar el mensaje de error despues de 3 segundos
  const hideErrorMessage = () => {
    setError(""); // Limpia el mensaje de error
  };

  // Hook useEffect para ocultar el mensaje de error despues de 3 segundos
  useEffect(() => {
    if (error) {
      // Temporizador de 3 segundos
      const timerId = setTimeout(hideErrorMessage, 3000); 
      // Limpia el temporizador al desmontar el componente
      return () => clearTimeout(timerId); 
    }
  }, [error]);

  return (
    <div className="pedirCitaEntera">
      <div className="formularioCita">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {error && <div className="error-message">{error}</div>}
        <h1>Concertar una Cita</h1>
        <Form onSubmit={handleSubmit} id="formularioInputs">
          {/* Espacio para la imagen */}
          <div className="imagenFija" />

          {/* Input para elegir fecha y hora */}
          <Form.Group id="inputFecha">
            <Form.Label>
              <strong>Fecha y hora</strong>
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha"
              onChange={handleDateChange}
              isInvalid={!horaValida || citaExistente}
            />
            <Form.Control.Feedback type="invalid">
              {citaExistente
                ? "Ya existe una cita reservada para la fecha y hora seleccionada."
                : "La cita debe ser en tramos de 30 minutos, de 9:00 a 13:00 y de 16:00 a 20:00 de lunes a sábado."}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Input para elegir empleado */}
          <Form.Group id="inputEmpleado">
            <Form.Label>
              <strong>Empleado</strong>
            </Form.Label>
            <Form.Control
              as="select"
              name="empleado_id"
              onChange={inputHandler}
            >
              <option value="">Selecciona un empleado</option>
              {empleados &&
                empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          {/* Input para elegir servicio */}
          <Form.Group id="inputServicio">
            <Form.Label>
              <strong>Servicio</strong>
            </Form.Label>
            <Form.Control
              as="select"
              name="servicio_id"
              onChange={inputHandler}
            >
              <option value="">Selecciona un servicio</option>
              {servicios &&
                servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre_servicio} - Precio:{" "}
                    {servicio.precio_servicio}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          {/* Input para el comentario */}
          <Form.Group id="inputComentario">
            <Form.Label>
              <strong>Comentario</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              name="comentario"
              onChange={inputHandler}
            />
          </Form.Group>

          <Button type="submit" id="botonConcertarCita">
            Concertar Cita
          </Button>
        </Form>
      </div>
    </div>
  );
};