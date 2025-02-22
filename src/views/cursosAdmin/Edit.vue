<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-lg w-100" style="max-width: 600px;">
        <h2 class="text-center mb-4">Editar Curso</h2>
  
        <form @submit.prevent="save" class="row g-3">
          <div class="col-md-12">
            <label class="form-label">Nombre</label>
            <input v-model="form.nombre" type="text" class="form-control" required>
          </div>
          <div class="col-md-12">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control" required></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Inicio</label>
            <input v-model="form.fecha_inicio" type="date" class="form-control" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Final</label>
            <input v-model="form.fecha_final" type="date" class="form-control" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Carga Horaria</label>
            <input v-model="form.carga_horaria" type="number" class="form-control" required>
          </div>
          <div class="col-md-12">
            <label class="form-label">Certificado Vista</label>
            <input type="file" class="form-control" @change="handleFileUpload">
          </div>
  
          <!-- Botones -->
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
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { sendRequest } from "@/functions";
  import { successAlert, errorAlert, confirmAlert } from "@/utils/alerts"; 
  
  const route = useRoute();
  const router = useRouter();
  const cursoNombre = ref(route.params.nombre);

  
  const form = ref({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_final: "",
    carga_horaria: "",
    certificado_vista: null,
  });
  
  // Obtener datos del curso para edición
  
  const getCurso = async () => {
    if (!cursoNombre.value) return;
    try {
        const response = await sendRequest("GET", {}, `/api/cursos/nombre/${cursoNombre.value}`, "");

        if (response.data) {
      form.value = response.data;
      
      // 🔹 Ahora mostramos un mensaje preguntando si desea editar
      confirmAlert("Usuario encontrado. ¿Deseas editar este curso?", () => {
        console.log("El usuario decidió editar."); // Acción si acepta
      });
    } else {
      errorAlert("curso no encontrado.");
      router.push("/cursosAdmin"); // Redirigir si no existe
    }
  } catch (error) {
    errorAlert("Error al obtener los datos del curso.");
    console.error("Error al obtener curso:", error);
  }
       
};

  
  onMounted(getCurso);
  
  const handleFileUpload = (event) => {
    form.value.certificado_vista = event.target.files[0];
  };
  
  // Guardar curso editado
  const save = async () => {
    try {
        const formData = new FormData();
        for (const key in form.value) {
            formData.append(key, form.value[key]);
        }
        await sendRequest("POST", formData, `/api/cursos/nombre/${cursoNombre.value}`, "multipart/form-data");
        successAlert("Curso actualizado correctamente").then(() => {
            router.push("/cursosAdmin");
        });
    } catch (error) {
        errorAlert("Error al actualizar el curso.");
        console.error("Error al actualizar curso:", error);
    }
  };

  
  const cancel = () => {
    confirmAlert("¿Seguro que quieres cancelar la edición?", () => {
      router.push("/cursosAdmin");
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
  