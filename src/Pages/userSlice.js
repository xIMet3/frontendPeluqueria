import { createSlice } from "@reduxjs/toolkit";

// Define un nuevo slice de Redux llamado "usuario"
export const userSlice = createSlice({
  // Nombre del slice
  name: "usuario",
  initialState: {
    // Estado inicial del slice
    credentials: {
      token: "",
    },
    data: {
      // Datos del usuario autenticado
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      codigo_postal: "",
      rol_id: 3, // ID del rol del usuario (valor predeterminado 3)
    },
  },

  // Define los reducers para manejar las acciones que modificaran el estado
  reducers: {
    // Reducer para la accion "login"
    login: (state, action) => {
      // Obtiene el payload de la accion
      const { payload } = action; 
      // Actualiza el estado con la informacion del usuario autenticado
      state.credentials.token = payload.token;
      state.data.nombre = payload.nombre;
      state.data.apellido = payload.apellido;
      state.data.email = payload.email;
      state.data.telefono = payload.telefono;
      state.data.codigo_postal = payload.codigo_postal;
      state.data.rol_id = payload.rol_id;
    },

    // Reducer para la accion "logout"
    logout: (state) => {
      // Restablece las credenciales y los datos del usuario al estado inicial
      state.credentials.token = "";
      state.data.nombre = "";
      state.data.apellido = "";
      state.data.email = "";
      state.data.telefono = "";
      state.data.codigo_postal = "";
      state.data.rol_id = "";
    },
  },
});

// Exporta los actions creados por el slice
export const { login, logout } = userSlice.actions;

// Define el selector para obtener el estado del slice
export const userData = (state) => state.usuario;

// Exporta el reducer generado por el slice
export default userSlice.reducer;