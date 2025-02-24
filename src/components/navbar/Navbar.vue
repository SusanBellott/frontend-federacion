<template>
  <div class="d-flex">
    <!-- Barra de navegación inicial (Se muestra si no hay usuario autenticado) -->
    <div v-if="!authStore.user" class="initial-navbar">
      <h1>Nombre de la Institución</h1>
      <button class="btn btn-primary" @click="router.push('/login')">Iniciar Sesión</button>
    </div>

    <!-- Sidebar y contenido principal (Se muestra si hay usuario autenticado) -->
    <template v-if="authStore.user">
      <div :class="['sidebar', { collapsed: isCollapsed }]">
        <div class="user-info" @click="toggleSidebar">
          <i class="bi bi-person-circle"></i>
          <p v-show="!isCollapsed">{{ authStore.user.primer_nombre }} ({{ authStore.user.rol }})</p>
        </div>

        <ul class="nav flex-column">
          <template v-if="authStore.user.rol === 'administrador'">
            <li v-for="item in adminMenu" :key="item.path" class="nav-item">
              <RouterLink :to="item.path" class="nav-link">
                <i :class="item.icon"></i>
                <span v-show="!isCollapsed">{{ item.text }}</span>
              </RouterLink>
            </li>
          </template>

          <template v-else>
            <li v-for="item in userMenu" :key="item.path" class="nav-item">
              <RouterLink :to="item.path" class="nav-link">
                <i :class="item.icon"></i>
                <span v-show="!isCollapsed">{{ item.text }}</span>
              </RouterLink>
            </li>
          </template>
        </ul>

        <!-- Botón de logout -->
        <button class="btn btn-danger w-100 mt-auto" @click="logout">
          <i class="bi bi-box-arrow-right"></i> 
          <span v-show="!isCollapsed">Salir</span>
        </button>

        <!-- Modo Oscuro -->
        <button class="btn btn-secondary w-100 mt-2" @click="toggleDarkMode">
          <i class="bi bi-moon"></i> 
          <span v-show="!isCollapsed">Modo Oscuro</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const authStore = useAuthStore();
const isCollapsed = ref(true); // Sidebar colapsado por defecto
const darkMode = ref(false);

const adminMenu = [
  { text: 'Usuarios', path: '/usuarios', icon: 'bi bi-people' },
  { text: 'Instituciones', path: '/instituciones', icon: 'bi bi-building' },
  { text: 'Cursos', path: '/cursosAdmin', icon: 'bi bi-book' },
  { text: 'Inscripciones', path: '/inscripciones', icon: 'bi bi-pencil' },
  { text: 'Certificados', path: '/certificados', icon: 'bi bi-award' }
];

const userMenu = [
  { text: 'Cursos', path: '/cursos', icon: 'bi bi-book' },
  { text: 'Cursos Inscritos', path: '/cursos-inscritos', icon: 'bi bi-clipboard-check' }
];

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.body.classList.toggle('dark-mode', darkMode.value);
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

// Redirigir al login si no hay usuario autenticado
watchEffect(() => {
  if (!authStore.user) {
    router.push('/login');
  }
});
</script>

<style scoped>
/* Barra de navegación inicial */
.initial-navbar {
  width: 100%;
  background-color: #dc3545; /* Fondo rojo */
  color: white; /* Texto blanco */
  padding: 1rem;
  display: flex;
  justify-content: space-between; /* Alinea los elementos a los extremos */
  align-items: center; /* Centra verticalmente */
  border-bottom: 1px solid #ddd;
}

.institution-name {
  margin: 0; /* Elimina el margen predeterminado del h1 */
  font-size: 1.5rem; /* Tamaño del texto */
}

.login-btn {
  background: white; /* Fondo blanco */
  color: #dc3545; /* Texto rojo */
  border: none; /* Sin borde */
  padding: 0.5rem 1rem; /* Espaciado interno */
  border-radius: 5px; /* Bordes redondeados */
  font-weight: bold; /* Texto en negrita */
  transition: background 0.3s, color 0.3s; /* Transición suave */
}

.login-btn:hover {
  background: #f8f9fa; /* Fondo gris claro al pasar el mouse */
  color: #c82333; /* Texto rojo oscuro al pasar el mouse */
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #dc3545;
  color: white;
  height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 70px;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.user-info {
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
}
.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.user-info i {
  font-size: 2rem;
}
.user-info p {
  margin-top: 5px;
}

.nav-link {
  color: white;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.nav-link i {
  font-size: 1.2rem;
}

.content {
  flex-grow: 1;
  padding: 1rem;
}

/* Modo Oscuro */
.dark-mode {
  background: #222;
  color: white;
}

/* Botón de Cerrar Sesión */
.btn-danger {
  margin-top: auto;
}
</style>