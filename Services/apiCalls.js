import axios from "axios";

export const registroUsuario = async (body) => {
    return await axios.post("http://localhost:3000/auth/registro", body);
};

export const loginUsuario = async (body) => {
    let res = await axios.post("http://localhost:3000/auth/login", body);
    return res.data.token;
  };

  export const cogerUserData = async (token) => {
    const res = await axios.get("http://localhost:3000/usuario/perfilUsuario", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data
    console.log(res.data)
  }