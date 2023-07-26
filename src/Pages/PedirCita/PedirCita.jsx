import React, { useState } from "react";
import "./PedirCita.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { crearCita } from "../../../Services/apiCalls";
import { userData } from "../userSlice";

export const PedirCita = () => {
  // Obtiene las credenciales del usuario
  const { credentials } = useSelector(userData);
  // Estado para almacenar los datos del formulario
  const [body, setBody] = useState({});
  // Estado para manejar errores en el formulario
  const [error, setError] = useState("");
  // Estado para mostrar el mensaje de exito
  const [successMessage, setSuccessMessage] = useState("");
  // Estado para mostrar le mensaje de no hay citas disponibles
  const [citasNoDisponibles, setCitasNoDisponibles] = useState(false);
  // Estado para almacenar las citas existentes
  const [citas, setCitas] = useState([]);
  //Hook de enrutamiento para redireccionar despues de enviar el formulario
  const navigate = useNavigate();
  // Funcion para manejar el cambio de valor en los campos del formulario
  const inputHandler = ({ target }) => {
    let { name, value } = target;
    setBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // Funcion para manejar el envio del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Valida si todos los campos del formulario estan seleccionados
    if (!body.fecha || !body.servicio_id || !body.empleado_id) {
      setError("Porfavor, selecciona todos los campos.");
    }
    // Obtiene la fecha y hora seleccionada y la fecha y hora actual
    const fechaSeleccionada = new Date(body.fecha);
    const fechaActual = new Date();
    // Valida que la fecha y hora seleccionada sea posterior a la actual
    if (fechaSeleccionada <= fechaActual) {
      setError("Selecciona una fecha y hora posterior a la actual.");
      return;
    }
    // Valida que la fecha seleccionada no sea domingo
    const concertarCita = () => {
      if (!fechaSeleccionada) {
        setError("Por favor, seleccione una fecha para concertar la cita.");
      }
      if (fechaSeleccionada.getDay() === 0) {
        setError("El horario es de lunes a sábado");
        return;
      }
    };
    // Valida el rango de horas disponibles
    const horaSeleccionada = fechaSeleccionada.getHours();
    const isHoraValida =
      (horaSeleccionada >= 9 && horaSeleccionada < 13) ||
      (horaSeleccionada >= 16 && horaSeleccionada < 20);
    if (!isHoraValida) {
      setError(
        "Las horas de cita disponibles son de 9:00 a 13 y de 16:00 a 20:00."
      );
      return;
    }

    try {
      crearCita(credentials.token, body)
        .then((res) => {
          if (res.succes) {
            setSuccessMessage("Su cita ha sido concertada con éxito");
            setTimeout(() => {
              navigate("/panelUsuario");
            }, 1500);
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };


return (
  <div className="pedirCitaEntera">
    
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
