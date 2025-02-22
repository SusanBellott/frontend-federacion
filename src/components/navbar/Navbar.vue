<template>
  <nav class="navbar navbar-expand-lg bg-success">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Mi Institución</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="authStore.user">
          <li class="nav-item px-lg-5 h4">
            {{ authStore.user.name }}
          </li>
          <li class="nav-item px-lg-5">
            <RouterLink to="/usuarios" class="nav-link">Usuarios</RouterLink>
          </li>
          <li class="nav-item px-lg-5">
            <RouterLink to="/instituciones" class="nav-link">Instituciones</RouterLink>
          </li>       
          <li class="nav-item px-lg-5">
            <RouterLink to="/cursosAdmin" class="nav-link">Cursos</RouterLink>
          </li>    
          <li class="nav-item px-lg-5">
            <RouterLink to="/certificadoAdmin" class="nav-link">Certificados</RouterLink>
          </li>   
        </ul>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="authStore.user">
          <li class="nav-item px-lg-5">
            <button @click="authStore.logout" class="btn btn-success">Salir</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore(); // 🔥 Ahora sí está correctamente instanciado

</script>

<style>
.navbar {
  padding: 1rem;
}
</style>

