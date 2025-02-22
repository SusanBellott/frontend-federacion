<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-lg w-100" style="max-width: 600px;">
          <h2 class="text-center mb-4">Agregar Nuevo Usuario</h2>
          
          <form @submit.prevent="save" class="row g-3">
              <div class="col-md-6">
                  <label class="form-label">Carnet</label>
                  <!-- <input v-model="form.carnet" type="text" class="form-control" required autofocus> -->
                  <!--<input type="text" v-model="numero" @input="permitirSoloNumeros" />-->
                  <input
      v-model="form.carnet"
      type="text"
      class="form-control"
      required
      @input="validarCarnet"
    />
              </div>
              <div class="col-md-6">
                  <label class="form-label">Primer Nombre</label>
                  <input v-model="form.primer_nombre" type="text" class="form-control" required>
              </div>
              <div class="col-md-6">
                  <label class="form-label">Segundo Nombre</label>
                  <input v-model="form.segundo_nombre" type="text" class="form-control">
              </div>
              <div class="col-md-6">
                  <label class="form-label">Apellido Paterno</label>
                  <input v-model="form.apellido_paterno" type="text" class="form-control">
              </div>
              <div class="col-md-6">
                  <label class="form-label">Apellido Materno</label>
                  <input v-model="form.apellido_materno" type="text" class="form-control">
              </div>
              <div class="col-md-6">
                  <label class="form-label">Rol</label>
                  <select v-model="form.rol" class="form-select" required>
                      <option value="administrador">Administrador</option>
                      <option value="usuario">Usuario</option>
                  </select>
              </div>
              <div class="col-md-6" v-if="form.rol === 'usuario'">
                  <label class="form-label">RDA</label>
                  <input v-model="form.rda" type="text" class="form-control">
              </div>
              <div class="col-12 d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" @click="router.push('/usuarios')">
                        <i class="fa-solid fa-xmark"></i> Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-floppy-disk"></i> Guardar Usuario
                    </button>
                </div>
          </form>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      numero: ""
    };
  },
  methods: {
    permitirSoloNumeros() {
      // Elimina cualquier carácter no numérico
      this.numero = this.numero.replace(/[^0-9]/g, "");
      
      // Limita la longitud a 12 caracteres
      if (this.numero.length > 12) {
        this.numero = this.numero.slice(0, 12);
      }
    }
  }
};
</script>

<script setup>
import { ref, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { sendRequest } from '@/functions';
import { useRouter } from 'vue-router';
import { useValidaciones } from "@/utils/validaciones"; // ✅ Importar

const authStore = useAuthStore();
const router = useRouter();
const { permitirSoloNumeros } = useValidaciones();

const form = ref({
  carnet: '',
  primer_nombre: '',
  segundo_nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  rol: 'usuario',
  rda: ''
});

//validaciones 
const validarCarnet = () => {
  form.value.carnet = permitirSoloNumeros(form.value.carnet);
};

// Guardar usuario y redirigir a la tabla
const save = async () => {
  try {
      const response = await sendRequest('POST', form.value, '/api/usuarios', '');
      alert(`Usuario creado con éxito. Contraseña generada: ${response.generated_password}`);
      
      // Limpiar formulario
      Object.keys(form.value).forEach((key) => (form.value[key] = ''));
      
      // Esperar que Vue procese el DOM y luego redirigir
      await nextTick();
        router.push('/usuarios');
  } catch (error) {
      console.error("Error al guardar usuario", error);
  }
};

// Cancelar y volver a la tabla
const cancel = () => {
  router.push("/usuarios");
};
</script>

<style scoped>
/* Asegura que el formulario esté centrado */
.container {
  max-width: 100%;
}

/* Tarjeta con sombra y diseño limpio */
.card {
  border-radius: 10px;
}
</style>
