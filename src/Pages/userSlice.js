import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "usuario",
  initialState: {
    credentials: {
      token: "",
    },
    data: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      codigo_postal: "",
      rol_id: 3,
    },
  },

  reducers: {
    login: (state, action) => {
      const { payload } = action;
      state.credentials.token = payload.token;
      state.data.nombre = payload.nombre;
      state.data.apellido = payload.apellido;
      state.data.email = payload.email;
      state.data.telefono = payload.telefono;
      state.data.codigo_postal = payload.codigo_postal;
      state.data.rol_id = payload.rol_id;
    },
    logout: (state) => {
      state.credentials.token = "";
      state.data.nombre = "";
      state.data.apellido = "";
      state.data.email = "";
      state.data.telefono = "";
      state.data.codigo_postal = "";
      state.data.rol_id = 3;
    },
  },
});

export const userData = (state) => state.usuario;
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
