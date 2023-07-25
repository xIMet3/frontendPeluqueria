import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "usuario",
  initialState: {
    credentials: {
      token: "",
    },
    data: {
      name: "",
      rol: 3,
    },
  },

  reducers: {
    login: (state, action) => {
      let { payload } = action;
      state.credentials = {
        token: payload.token,
      },
        state.data = {
          name: payload.name,
          rol_id: payload.rol_id,
          phone: payload.phone,
          email: payload.email,
        };
    },
    logout: (state) => {
      return {
        ...state,
        credentials: {
          token: "",
        },
        data: {
          name: "",
          rol: "",
        },
      };
    },
  },
});

export const userData = (state) => state.usuario;
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
