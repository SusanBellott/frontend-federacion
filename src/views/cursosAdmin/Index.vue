<template>
    <div class="container mt-4">
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
                    <input 
                        type="text" 
                        class="form-control" 
                        v-model="criterioBusqueda" 
                        placeholder="Buscar por nombre de curso..." 
                        @input="buscarCursos"
                    />
                    <button class="btn btn-outline-success" type="button" @click="buscarCursos">Buscar</button>
                </div>
            </div>
        </div>

        <!-- Tabla de cursos -->
        <div class="row mt-3">
            <div class="col-12">
                <div v-if="!cargando" class="card border border-white text-center">
                    <div class="card-body">
                        <img src="/loading.gif" class="img-fluid" />
                    </div>
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-bordered table-hover table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nombre del Curso</th>
                                <th>Descripción</th>
                                <th>Fecha de Inicio</th>
                                <th>Fecha de Final</th>
                                <th>Carga Horaria </th>
                                <th>Imagen de certificado </th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(curso, index) in cursos" :key="curso.id">
                                <td>{{ (index + 1) + (pagina - 1) * perPage }}</td>
                                <td>{{ curso.nombre }}</td>
                                <td>{{ curso.descripcion || '-' }}</td>
                                <td>{{ curso.fecha_inicio}}</td>
                                <td>{{ curso.fecha_final}}</td>
                                <td>{{ curso.carga_horaria }}</td>
                                <td>{{ curso.certificado_vista }}</td>
                                <td>{{ curso.estado }}</td>
                                <td class="acciones">
                                    <router-link 
                                        :to="{ name: 'cursosAdmin-edit', params: { id: curso.id } }" 
                                        class="btn btn-warning me-2">
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
const perPage = 10;
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
        const response = await axios.get(`/api/cursos/nombre/${criterioBusqueda.value}`);
        cursos.value = response.data.data ? [response.data.data] : [];
    } catch (error) {
        console.error("Curso no encontrado", error);
        cursos.value = [];
    }
};

// Cambiar de página
const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > paginacion.value.last_page) return;
    obtenerCursos(nuevaPagina);
};

// Eliminar curso
const eliminarCurso = (id) => {
    confirmation("¿Estás seguro de eliminar este curso?", `/api/cursos/${id}`, '/cursosAdmin');
};

// Cargar cursos al montar el componente
onMounted(() => obtenerCursos());

</script>

<style scoped>
/* Mantener la tabla bien alineada */
.table {
    text-align: center;
}

/* Botones de acciones alineados y con espacio */
.acciones {
    white-space: nowrap;
    width: 120px;
}

.acciones .btn {
    display: inline-block;
    margin: 0 5px;
}

/* Estilizar la tabla */
.table-bordered th, .table-bordered td {
    vertical-align: middle;
}

/* Estilos para paginación */
.page-item .page-link {
    cursor: pointer;
}
</style>
