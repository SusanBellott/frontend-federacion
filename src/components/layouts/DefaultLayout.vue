<!-- src/layouts/DefaultLayout.vue -->
<template>
    <div :class="{ 'dark-mode': isDarkMode }">
      <Navbar />
      <main class="content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import Navbar from '@/components/navbar/Navbar.vue';
  
  export default {
    components: { Navbar },
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
  </style>
  