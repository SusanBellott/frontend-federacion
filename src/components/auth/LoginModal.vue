<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Iniciar Sesión</h5>
            <button type="button" class="close-btn" @click="$emit('close')">
            <i class="bi bi-x-lg"></i> <!-- Ícono de Bootstrap -->
          </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="carnet"><i class="fas fa-id-card"></i> Carnet</label>
                <input type="text" id="carnet" class="form-control" v-model="carnet" required>
              </div>
              <div class="form-group">
                <label for="password"><i class="fas fa-lock"></i> Contraseña</label>
                <input type="password" id="password" class="form-control" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-danger mt-3 w-100">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const form = ref({carnet: '', password: ''});

</script>

<style scoped>
/* Fondo oscuro al rededor */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(231, 201, 201, 0.5);
  z-index: 1000;
}

/* Cuadro del modal con degradado plomo */
.modal-dialog {
  background: linear-gradient(135deg, #606060, #a0a0a0); /* Degradado plomo */
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
  position: relative;
}

/* Cabecera del modal */
.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra el texto */
  text-align: center;
  border-bottom: 2px solid #dc3545;
  padding-bottom: 10px;
  position: relative;
}

/* Botón de cerrar con ícono Bootstrap */
.close-btn {
  position: absolute;
  right: 15px;
  top: 0px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
  transition: 0.3s;
}

.close-btn:hover {
  color: #dc3545;
}

/* Estilo de los inputs */
.form-group {
  margin-top: 15px;
}
.form-group label {
  font-weight: bold;
  color: white;
}
.form-control {
  width: 100%;
  padding: 10px;
  border: 2px solid #dc3545;
  border-radius: 5px;
}

/* Botón de login */
.btn-danger {
  background: #dc3545;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-danger:hover {
  background: #c82333;
}

/* Animación */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>