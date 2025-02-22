// src/store/theme.js
export default {
    namespaced: true,
    state: {
      darkMode: localStorage.getItem('darkMode') === 'true' // Cargar desde localStorage
    },
    mutations: {
      TOGGLE_DARK_MODE(state) {
        state.darkMode = !state.darkMode;
        localStorage.setItem('darkMode', state.darkMode);
      }
    },
    getters: {
      isDarkMode: state => state.darkMode
    }
  };
  