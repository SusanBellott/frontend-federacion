<template>
    <div class="container-fluid mt-4 d-flex flex-column flex-grow-1">
        <!-- Barra superior (Botón y buscador) -->
        <div class="row align-items-center mb-3">
            <div class="col-md-6 mb-2 mb-md-0">
                <router-link :to="{ name: 'cursosAdmin-create' }" class="btn btn-dark w-100 w-md-auto">
                    <i class="fa-solid fa-circle-plus"></i> Agregar Curso
                </router-link>
            </div>
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                    <input type="text" class="form-control" v-model="criterioBusqueda" placeholder="Buscar por nombre..." @input="buscarCursos"/>
                    <button class="btn btn-outline-success" type="button" @click="buscarCursos">Buscar</button>
                </div>
            </div>
        </div>

        <!-- Tabla de cursos -->
        <div class="row flex-grow-1 overflow-auto">
            <div class="col-12">
                <div v-if="!cargando" class="card border border-white text-center">
                    <div class="card-body">
                        <img src="/loading.gif" class="img-fluid" />
                    </div>
                </div>

                <div v-else class="table-responsive flex-grow-1">
                    <table class="table table-bordered table-hover table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Fecha de Inicio</th>
                                <th>Fecha Final</th>
                                <th>Carga Horaria</th>
                                <th>Certificado Vista</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(curso, index) in cursos" :key="curso.id">
                                <td>{{ (index + 1) + (pagina - 1) * perPage }}</td>
                                <td>{{ curso.nombre }}</td>
                                <td>{{ curso.descripcion }}</td>
                                <td>{{ curso.fecha_inicio }}</td>
                                <td>{{ curso.fecha_final }}</td>
                                <td>{{ curso.carga_horaria }}</td>
                                <td>
                                    <img v-if="curso.certificado_vista && curso.certificado_vista.startsWith('http')" 
                                        :src="curso.certificado_vista" 
                                        alt="Certificado" 
                                        class="img-thumbnail" 
                                        style="width: 100px; height: auto;"/>
                                    <span v-else>No disponible</span>
                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input 
    class="form-check-input" 
    type="checkbox" 
    role="switch" 
    :id="'switch-' + curso.id" 
    v-model="curso.estado" 
    :true-value="true" 
    :false-value="false" 
    @change="cambiarEstadoCurso(curso)"  
/>

                                            <label class="form-check-label" :for="'switch-' + curso.id">
                                            {{ curso.estado ? '' : '' }}
                                            </label>
                                     </div>
                                </td>
                                <td class="acciones">
                                    <router-link 
    :to="{ name: 'cursosAdmin-edit', params: { id: curso.id } }" 
    class="btn btn-warning me-2"
>
    <i class="fa-solid fa-edit"></i>
</router-link>

                                    <button class="btn btn-danger" @click="eliminarCurso(curso.id)">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Paginación -->
                    <nav>
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ disabled: !paginacion.prev }">
                                <button class="page-link" @click="cambiarPagina(pagina - 1)">Anterior</button>
                            </li>
                            <li class="page-item" v-for="p in paginacion.last_page" :key="p" :class="{ active: p === pagina }">
                                <button class="page-link" @click="cambiarPagina(p)">{{ p }}</button>
                            </li>
                            <li class="page-item" :class="{ disabled: !paginacion.next }">
                                <button class="page-link" @click="cambiarPagina(pagina + 1)">Siguiente</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { confirmation } from '@/functions';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`;

const cursos = ref([]);
const cargando = ref(false);
const criterioBusqueda = ref('');
const pagina = ref(1);
const perPage = 15;
const paginacion = ref({});


// Obtener cursos con paginación
const obtenerCursos = async (page = 1) => {
    cargando.value = false;
    try {
        const response = await axios.get(`/api/cursos?page=${page}&per_page=${perPage}`);
        cursos.value = response.data.data;
        paginacion.value = response.data;
        pagina.value = response.data.current_page;
    } catch (error) {
        console.error("Error al obtener cursos:", error);
    } finally {
        cargando.value = true;
    }
};

// Buscar curso por nombre
const buscarCursos = async () => {
    if (!criterioBusqueda.value.trim()) {
        obtenerCursos();
        return;
    }

    try {
        const response = await axios.get(`/api/cursos?nombre=${criterioBusqueda.value}`);
        cursos.value = response.data.data;
        paginacion.value = response.data;  // ✅ Actualiza la paginación con los resultados filtrados
    } catch (error) {
        console.error("Error al buscar cursos:", error);
    }
};

// Cambiar de página
const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > paginacion.value.last_page) return;
    obtenerCursos(nuevaPagina);
};
const cambiarEstadoCurso = async (curso) => {
    const estadoAnterior = curso.estado;

    try {
        const response = await axios.put(`/api/cursos/${curso.id}/estado`, {
            estado: curso.estado
        });

        curso.estado = response.data.estado;
    } catch (error) {
        console.error("Error al cambiar el estado del curso:", error);
        curso.estado = estadoAnterior;
        alert("No se pudo cambiar el estado del curso. Inténtalo nuevamente.");
    }
};






// Eliminar curso
const eliminarCurso = (id) => {
    confirmation("¿Estás seguro de eliminar este curso?", `/api/cursos/${id}`, '/cursos');
};

// Cargar cursos al montar el componente
onMounted(() => obtenerCursos(1)); // Asegura que carga desde la primera página

</script>
<style scoped>
.table {
    text-align: center;
}
.acciones {
    white-space: nowrap;
    width: 120px;
}
.acciones .btn {
    display: inline-block;
    margin: 0 5px;
}
.table-bordered th, .table-bordered td {
    vertical-align: middle;
}
.page-item .page-link {
    cursor: pointer;
}
.switch-estado {
    width: 40px; 
    height: 40px;
    cursor: pointer;
    transition: transform 0.2s;
}

.switch-estado:hover {
    transform: scale(1.1);
}

</style>
