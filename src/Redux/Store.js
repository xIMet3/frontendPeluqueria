import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import userSlice from "../Pages/userSlice";
import persistReducer from "redux-persist/es/persistReducer";
import thunk from "redux-thunk";
import persistStore from "redux-persist/es/persistStore";

// Se define un objeto persistConfig que especifica la clave principal (key) para el almacenamiento persistente y
// el objeto storage que representa el almacenamiento utilizado (en este caso, redux-persist/lib/storage).
const persistConfig = {
  key: "root",
  storage,
};
// Se utiliza combineReducers para combinar los reducers individuales en uno solo. En este caso, solo se tiene
// un reducer llamado user que proviene del archivo userSlice.
const rootReducer = combineReducers({
  user: userSlice,
});

// Se utiliza persistReducer para envolver el rootReducer con la configuración de persistencia especificada en
// persistConfig. Esto permite que los datos almacenados en la store de Redux se guarden y restauren automáticamente
// durante las sesiones.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Se utiliza configureStore para crear la store de Redux. Se pasa el persistedReducer como el reducer principal
// y se agrega thunk como middleware para permitir acciones asíncronas. La store resultante se exporta como
// store para que pueda ser utilizada en otros componentes.
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
