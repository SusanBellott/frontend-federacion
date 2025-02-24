<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4 shadow-lg w-100" style="max-width: 600px;">
            <h2 class="text-center mb-4">Agregar Nuevo Curso</h2>

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
                            :checked="form.estado"
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
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
                        <i v-else class="fa-solid fa-floppy-disk"></i> Guardar Curso
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref  } from 'vue';
import { sendRequest } from '@/functions';
import { useRouter } from 'vue-router';
import { successAlert, errorAlert } from "@/utils/alerts";

const router = useRouter();
const loading = ref(false);

const form = ref({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_final: '',
    carga_horaria: '',
    estado: true,
    certificado_vista: null
});

// Manejo del archivo de imagen
const handleFileUpload = (event) => {
    form.value.certificado_vista = event.target.files[0] || null;
};

// Guardar curso y redirigir
const save = async () => {
    try {
        const formData = new FormData();
        formData.append("nombre", form.value.nombre);
        formData.append("descripcion", form.value.descripcion);
        formData.append("fecha_inicio", form.value.fecha_inicio || '');
        formData.append("fecha_final", form.value.fecha_final || '');
        formData.append("carga_horaria", parseInt(form.value.carga_horaria) || 0);
        formData.append("estado", form.value.estado ? 1 : 0);

        if (form.value.certificado_vista instanceof File) {
            formData.append("certificado_vista", form.value.certificado_vista);
        } else if (typeof form.value.certificado_vista === "string") {
            formData.append("certificado_vista_url", form.value.certificado_vista);
        }

        console.log("Datos enviados:", Object.fromEntries(formData.entries()));

        const response = await sendRequest("POST", formData, "/api/cursos", {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log("Respuesta del servidor:", response);

        await successAlert("Curso creado correctamente");

        console.log("Redirigiendo a:", { name: 'cursosAdmin' });
router.push({ name: 'cursosAdmin' });

    } catch (error) {
        console.error("Error en la petición:", error.response?.data);
        console.error("Errores específicos:", error.response?.data?.errors);
        errorAlert("Error al crear el curso. Revisa la consola para más detalles.");
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

