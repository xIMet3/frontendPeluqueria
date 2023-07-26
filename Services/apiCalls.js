import axios from "axios";

// Registro usuario
export const registroUsuario = async (body) => {
  return await axios.post("http://localhost:3000/auth/registro", body);
};

// Login usuario
export const loginUsuario = async (body) => {
  let res = await axios.post("http://localhost:3000/auth/login", body);
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
    const res = await axios.put("http://localhost:3000/usuario/modificarPerfil", userData,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
    console.log(res.data);
};
