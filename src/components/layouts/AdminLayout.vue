<!-- src/layouts/AdminLayout.vue -->
<template>
    <div :class="{ 'dark-mode': isDarkMode }">
      <Sidebar />
      <main class="content">
        <router-view />
      </main>
      <div>
    <h1>Bienvenido al Panel de Administrador</h1>
    <p>Esta es la vista del admin.</p>
  </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import Sidebar from '@/components/navbar/Sidebar.vue';
  
  export default {
    components: { Sidebar },
    setup() {
      const store = useStore();
      const isDarkMode = computed(() => store.getters['theme/isDarkMode']);
  
      onMounted(() => {
        document.body.classList.toggle('dark-mode', isDarkMode.value);
      });
  
      return { isDarkMode };
    }
  };
  </script>
  
  <style>
  .dark-mode {
    background: #1e1e1e;
    color: white;
  }
  .content {
    padding: 20px;
  }
  </style>
  