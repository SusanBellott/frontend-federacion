import { createStore } from 'vuex';
import auth from './auth'; // Asegúrate de que el path sea correcto
import theme from './theme';
const store = createStore({
  modules: {
    auth, // Se registra como módulo aquí
    theme

  }
});

export default store;


