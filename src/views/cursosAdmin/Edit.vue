<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-lg w-100" style="max-width: 600px;">
        <h2 class="text-center mb-4">Editar Curso</h2>

        <form @submit.prevent="save" class="row g-3">
              <div class="col-12">
                  <label class="form-label">Nombre del Curso</label>
                  <input v-model="form.nombre" type="text" class="form-control" required autofocus>
              </div>

              <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea v-model="form.descripcion" class="form-control" rows="3" required></textarea>
              </div>

              <div class="col-md-6">
                  <label class="form-label">Fecha de Inicio</label>
                  <input v-model="form.fecha_inicio" type="date" class="form-control" required min="2025-01-01" max="2030-12-31">
              </div>

              <div class="col-md-6">
                  <label class="form-label">Fecha Final</label>
                  <input v-model="form.fecha_final" type="date" class="form-control" required min="2025-01-01" max="2030-12-31">
              </div>

              <div class="col-md-6">
                  <label class="form-label">Carga Horaria</label>
                  <input v-model="form.carga_horaria" type="number" class="form-control" required>
              </div>

              <div class="col-md-6">
                  <label class="form-label">Estado</label>
                  <div class="form-check form-switch">
                      <input 
                          class="form-check-input" 
                          type="checkbox" 
                          role="switch" 
                          id="estadoSwitch" 
                          v-model="form.estado"
                      >
                      <label class="form-check-label" for="estadoSwitch">
                          {{ form.estado ? 'Activo' : 'Inactivo' }}
                      </label>
                  </div>
              </div>

              <div class="col-12">
                  <label class="form-label">Certificado Vista (Imagen)</label>
                  <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
              </div>

              <div class="col-12 d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" @click="cancel">
                      <i class="fa-solid fa-xmark"></i> Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-save"></i> Actualizar Curso
          </button>
              </div>
          </form>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { sendRequest } from '@/functions';
import { useRouter, useRoute } from 'vue-router';
import { successAlert, errorAlert } from "@/utils/alerts";
import axios from 'axios';
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);

const form = ref({
  nombre: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_final: '',
  carga_horaria: '',
  estado: true,
  certificado_vista: null
});

// Función para obtener los datos del curso si se está editando


const getCurso = async () => {
  if (!id.value) return;

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/cursos/${id.value}`);
    const data = response.data;
    console.log("ID del curso:", id.value);
    console.log("Raw API response:", data); 
    console.log(router.getRoutes());

    if (data) {
      form.value = { 
        ...data, 
        carga_horaria: Number(data.carga_horaria), 
        estado: Boolean(data.estado) 
      };
    } else {
      errorAlert("Curso no encontrado.");
      router.push({ name: 'CursosAdmin' });

    }
  } catch (error) {
    errorAlert("Error al obtener los datos del curso.");
    console.error("Error al obtener curso:", error);
  }
};


onMounted(getCurso);

// Manejo del archivo de imagen
const handleFileUpload = (event) => {
  form.value.certificado_vista = event.target.files[0] || null;
};
// Guardar usuario editado
const save = async () => {
  try {
    let formData = new FormData();

    // Agregar campos al FormData
    formData.append('nombre', form.value.nombre);
    formData.append('descripcion', form.value.descripcion);
    formData.append('fecha_inicio', form.value.fecha_inicio);
    formData.append('fecha_final', form.value.fecha_final);
    formData.append('carga_horaria', form.value.carga_horaria);
    formData.append('estado', form.value.estado ? 1 : 0); // Convertir a 1 o 0 para Laravel

    // Verificar si hay un archivo seleccionado
    if (form.value.certificado_vista) {
      formData.append('certificado_vista', form.value.certificado_vista);
    }

    // Verificar los datos que se están enviando
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Enviar la solicitud PATCH con axios
    const response = await axios.post(
      `http://127.0.0.1:8000/api/cursos/${id.value}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegurar el tipo de contenido
        },
        params: {
          '_method': 'PATCH', // Indicar que es una solicitud PATCH
        },
      }
    );

    console.log('Respuesta del backend:', response.data); // Verificar la respuesta

    if (response.status === 200) {
      successAlert("Curso actualizado correctamente").then(() => {
        router.push({ name: 'cursosAdmin' });
      });
    } else {
      errorAlert("Error al actualizar el curso.");
    }
  } catch (error) {
    errorAlert("Error al actualizar el curso.");
    console.error("Error al actualizar curso:", error.response?.data || error.message);
  }
};


// Cancelar y volver a la tabla
const cancel = () => {
  router.push({ name: 'cursosAdmin' }); // Usa el nombre correcto en minúsculas

};
</script>

<style scoped>
.container {
  max-width: 100%;
}

.card {
  border-radius: 10px;
}
</style>
