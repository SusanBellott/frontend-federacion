// src/components/Sidebar.vue
<template>
  <div :class="['sidebar', { 'dark-mode': isDarkMode }]">
    <button class="btn btn-toggle" @click="toggleDarkMode">
      {{ isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro' }}
    </button>
    <ul v-if="user && user.rol === 'administrador'">
      <li><router-link to="/admin">Dashboard</router-link></li>
      <li><router-link to="/usuarios">Usuarios</router-link></li>
      <li><router-link to="/instituciones">Instituciones</router-link></li>
      <li><router-link to="/cursos">Cursos</router-link></li>
      <li><router-link to="/inscritos">Inscritos</router-link></li>
      <li><router-link to="/certificados">Certificados</router-link></li>
    </ul>
    <ul v-if="user && user.rol === 'usuario'">
      <li><router-link to="/user">Dashboard</router-link></li>
      <li><router-link to="/cursos">Cursos para Inscribirse</router-link></li>
      <li><router-link to="/mis-cursos">Mis Cursos Inscritos</router-link></li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.state.auth.user);
    const isDarkMode = computed(() => store.state.theme.darkMode);
    
    const toggleDarkMode = () => {
      store.commit('theme/TOGGLE_DARK_MODE');
    };
    
    return { user, isDarkMode, toggleDarkMode };
  }
};
</script>

<style>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}
.sidebar.dark-mode {
  background: #343a40;
  color: white;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  margin: 10px 0;
}
</style>
