<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow-lg w-100" style="max-width: 600px;">
      <h2 class="text-center mb-4">Editar Usuario</h2>

      <form @submit.prevent="save" class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Carnet</label>
          <input v-model="form.carnet" type="text" class="form-control" disabled>
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

        <!-- Botones -->
        <div class="col-12 d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="cancel">
            <i class="fa-solid fa-xmark"></i> Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-save"></i> Actualizar Usuario
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sendRequest } from "@/functions";
import { successAlert, errorAlert, confirmAlert } from "@/utils/alerts"; 

const route = useRoute();
const router = useRouter();
const carnet = ref(route.params.carnet);

const form = ref({
  carnet: "",
  primer_nombre: "",
  segundo_nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  rol: "usuario",
  rda: "",
});

// Obtener datos del usuario para edición
const getUsuario = async () => {
  if (!carnet.value) return;
  try {
    const response = await sendRequest("GET", {}, `/api/usuarios/carnet/${carnet.value}`, "");

    if (response.data) {
      form.value = response.data;
      
      // 🔹 Ahora mostramos un mensaje preguntando si desea editar
      confirmAlert("Usuario encontrado. ¿Deseas editar este usuario?", () => {
        console.log("El usuario decidió editar."); // Acción si acepta
      });
    } else {
      errorAlert("Usuario no encontrado.");
      router.push("/usuarios"); // Redirigir si no existe
    }
  } catch (error) {
    errorAlert("Error al obtener los datos del usuario.");
    console.error("Error al obtener usuario:", error);
  }
};

onMounted(getUsuario);

// Guardar usuario editado
const save = async () => {
  try {
    await sendRequest("PUT", form.value, `/api/usuarios/carnet/${carnet.value}`, "");
    successAlert("Usuario actualizado correctamente").then(() => {
      router.push("/usuarios");
    });
  } catch (error) {
    errorAlert("Error al actualizar el usuario.");
    console.error("Error al actualizar usuario:", error);
  }
};

// Cancelar edición con confirmación
const cancel = () => {
  confirmAlert("¿Seguro que quieres cancelar la edición?", () => {
    router.push("/usuarios");
  });
};
</script>

<style scoped>
.container {
  max-width: 100%;
}

.card {
  border-radius: 10px;
}

.btn {
  width: auto;
}
</style>
