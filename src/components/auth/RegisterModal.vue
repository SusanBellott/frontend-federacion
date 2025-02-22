<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registro de Usuario</h5>
            <button type="button" class="close-btn" @click="$emit('close')">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="register">
              <div class="form-group">
                <label for="nombre"><i class="bi bi-person"></i> Nombre Completo</label>
                <input type="text" id="nombre" class="form-control" v-model="nombre" required>
              </div>
              <div class="form-group">
                <label for="carnet"><i class="bi bi-card-checklist"></i> Carnet</label>
                <input type="text" id="carnet" class="form-control" v-model="carnet" required>
              </div>
              <div class="form-group">
                <label for="email"><i class="bi bi-envelope"></i> Correo Electrónico</label>
                <input type="email" id="email" class="form-control" v-model="email" required>
              </div>
              <div class="form-group">
                <label for="password"><i class="bi bi-lock"></i> Contraseña</label>
                <input type="password" id="password" class="form-control" v-model="password" required>
              </div>
              <div class="form-group">
                <label for="confirmPassword"><i class="bi bi-lock-fill"></i> Confirmar Contraseña</label>
                <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" required>
              </div>
              <button type="submit" class="btn btn-danger mt-3 w-100">Registrarse</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nombre: '',
        carnet: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          alert('Las contraseñas no coinciden.');
          return;
        }
        
        const newUser = {
          nombre: this.nombre,
          carnet: this.carnet,
          email: this.email,
          password: this.password
        };
  
        this.$emit('register', newUser);
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Fondo oscuro */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  
  /* Modal con degradado plomo */
  .modal-dialog {
    background: linear-gradient(135deg, #606060, #a0a0a0);
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease-in-out;
    position: relative;
  }
  
  /* Cabecera */
  .modal-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-bottom: 2px solid #dc3545;
    padding-bottom: 10px;
    position: relative;
  }
  
  /* Botón de cerrar */
  .close-btn {
    position: absolute;
    right: 15px;
    top: 10px;
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
  
  /* Inputs */
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
  
  /* Botón de registro */
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
  