import axios from "axios";

// Registro usuario
export const registroUsuario = async (body) => {
  return await axios.post("https://backend-peluqueria.vercel.app/auth/registro", body);
};

// Login usuario
export const loginUsuario = async (body) => {
  const res = await axios.post("https://backend-peluqueria.vercel.app/auth/login", body);
  return res.data.token;
};

// Mostrar perfil usuario
export const cogerUserData = async (token) => {
  const res = await axios.get("https://backend-peluqueria.vercel.app/usuario/perfilUsuario", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Modificar perfil usuario
export const modificarUsuario = async (token, userData) => {
  const res = await axios.put(
    "https://backend-peluqueria.vercel.app/usuario/modificarPerfil",
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
    "https://backend-peluqueria.vercel.app/cita/solicitarCita",
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
  const res = await axios.get("https://backend-peluqueria.vercel.app/usuario/verEmpleados");
  return res.data;
};

// Traer todos los servicios
export const mostrarServicios = async () => {
  const res = await axios.get("https://backend-peluqueria.vercel.app/usuario/verServicios");
  return res.data;
};

// Ver mis citas como usuario
export const verMisCitas = async (token) => {
  const res = await axios.get("https://backend-peluqueria.vercel.app/cita/misCitas", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data.data;
};

// Ver todas las citas como empleado y admin
export const todasLasCitas = async (token, citaData) => {
  const res = await axios.get("https://backend-peluqueria.vercel.app/empleado/todasLasCitas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: citaData,
  });
  return res.data;
}
// Cambiar estado de la cita a Cancelada
export const modificarCancelarCita = async (token, citaId) => {
    const res = await axios.put(
      `https://backend-peluqueria.vercel.app/empleado/modificarCita/${citaId}`,
      { cita_estado_id: 2 }, // Aqui modifica el estado de la cita a 2 (Cancelada)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
};

// Cambiar el estado de la cita a Realizada
export const modificarCitaRealizada = async (token, citaId) => {
  const res = await axios.put(
    `https://backend-peluqueria.vercel.app/empleado/modificarCita/${citaId}`,
    { cita_estado_id: 3 }, // Aqui modifica el estado de la cita a 3 (Realizada)
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Modificar cita
export const modificarCita = async (token, citaData) => {
  const res = await axios.put(`https://backend-peluqueria.vercel.app/empleado/modificarCita/${citaData.id}`, citaData, {
    headers: {
      Authorization:`Bearer ${token}`,
    },
  });
  return res.data;
};

// Obtener todos los estados de las citas
export const obtenerEstadosCita = async (token) => {
  const res = await axios.get("https://backend-peluqueria.vercel.app/empleado/obtenerEstados", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return res.data;
};

// Obtener todos los usuarios registrados
export const todosLosUsuarios = async (token) => {
  const res = await axios.get("https://backend-peluqueria.vercel.app/admin/todosLosUsuarios", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// Eliminar un usuario
export const eliminarUsuario = async (usuarioId, token) => {
  const res = await axios.delete(`https://backend-peluqueria.vercel.app/admin/eliminarUsuario/${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};