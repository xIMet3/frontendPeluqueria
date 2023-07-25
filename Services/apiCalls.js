import axios from "axios";

export const registroUsuario = async (body) => {
    return await axios.post("http://localhost:3000/auth/registro", body);
};