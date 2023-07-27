import axios from "axios";

// Registro usuario
export const registroUsuario = async (body) => {
  return await axios.post("http://localhost:3000/auth/registro", body);
};

// Login usuario
export const loginUsuario = async (body) => {
  const res = await axios.post("http://localhost:3000/auth/login", body);
  return res.data.token;
};

// Mostrar perfil usuario
export const cogerUserData = async (token) => {
  const res = await axios.get("http://localhost:3000/usuario/perfilUsuario", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Modificar perfil usuario
export const modificarUsuario = async (token, userData) => {
  const res = await axios.put(
    "http://localhost:3000/usuario/modificarPerfil",
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
  console.log(res.data);
};

// Solicitar una cita
export const crearCita = async (token, citaData) => {
  const res = await axios.post(
    "http://localhost:3000/cita/solicitarCita",
    citaData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Traer los empleados
export const mostrarEmpleados = async () => {
  const res = await axios.get("http://localhost:3000/usuario/verEmpleados");
  return res.data;
};

// Traer todos los servicios
export const mostrarServicios = async () => {
  const res = await axios.get("http://localhost:3000/usuario/verServicios");
  return res.data;
};
