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
                <div class="col-12">
                    <label class="form-label">Certificado Vista (Imagen)</label>
                    <input type="file" class="form-control" @change="handleFileUpload">
                </div>
                <div class="col-12 d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" @click="cancel">
                        <i class="fa-solid fa-xmark"></i> Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-floppy-disk"></i> Guardar Curso
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { sendRequest } from '@/functions';
import { useRouter } from 'vue-router';
import { successAlert, errorAlert } from "@/utils/alerts";

const router = useRouter();

const form = ref({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_final: '',
    carga_horaria: '',
    certificado_vista: null // Para almacenar la imagen
});

// Manejo del archivo de imagen
const handleFileUpload = (event) => {
    form.value.certificado_vista = event.target.files[0] || null;
};

// Guardar curso y redirigir
const save = async () => {
    try {
        const formData = new FormData();

        // Agregar los campos de texto
        formData.append("nombre", form.value.nombre);
        formData.append("descripcion", form.value.descripcion);
        formData.append("fecha_inicio", form.value.fecha_inicio);
        formData.append("fecha_final", form.value.fecha_final);
        formData.append("carga_horaria", form.value.carga_horaria);

        // Agregar el archivo solo si se ha seleccionado
        if (form.value.certificado_vista) {
            formData.append("certificado_vista", form.value.certificado_vista);
        }

        console.log("Datos enviados a la API:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // Hacer la petición a la API
        const response = await sendRequest("POST", formData, "/api/cursos");

        console.log("Curso creado con éxito:", response);
        successAlert("Curso creado correctamente").then(() => {
            router.push("/cursosAdmin");
        });

    } catch (error) {
        console.error("Error al crear curso:", error.response?.data);
        errorAlert(error.response?.data?.message || "Error al crear el curso.");
    }
};


// Cancelar y volver a la tabla
const cancel = () => {
    router.push("/cursosAdmin");
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
