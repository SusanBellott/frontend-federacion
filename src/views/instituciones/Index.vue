<template>
    <div class="container-fluid mt-4 d-flex flex-column flex-grow-1">
        <!-- Barra superior (Botón y buscador) -->
        <div class="row align-items-center mb-3">
            <div class="col-md-6 mb-2 mb-md-0">
                <router-link :to="{ name: 'instituciones-create' }" class="btn btn-dark w-100 w-md-auto">
                    <i class="fa-solid fa-circle-plus"></i> Agregar Institución
                </router-link>
            </div>
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                    <input 
                        type="text" 
                        class="form-control" 
                        v-model="criterioBusqueda" 
                        placeholder="Buscar por RDA..." 
                        @input="buscarInstituciones"
                    />
                    <button class="btn btn-outline-success" type="button" @click="buscarInstituciones">Buscar</button>
                </div>
            </div>
        </div>

        <!-- Mensaje de carga -->
        <div v-if="cargando" class="text-center flex-grow-1 d-flex align-items-center justify-content-center">
            <p>Cargando instituciones...</p>
        </div>

        <!-- Tabla de instituciones -->
        <div v-else class="row flex-grow-1 overflow-auto">
            <div class="col-12">
                <div v-if="instituciones.length" class="table-responsive flex-grow-1">
                    <table class="table table-bordered table-hover table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>RDA</th>
                                <th>Código Distrito</th>
                                <th>Descripción Distrito</th>
                                <th>Subsistema</th>
                                <th>Servicio</th>
                                <th>Años de Servicio</th>
                                <th>Nivel</th>
                                <th>Programa</th>
                                <th>Nombre Institución</th>
                                <th>Item</th>
                                <th>Cargo</th>
                                <th>Horas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(institucion, index) in instituciones" :key="institucion.id">
                                <td>{{ (index + 1) + (pagina - 1) * perPage }}</td>
                                <td>{{ institucion.rda }}</td>
                                <td>{{ institucion.codigo_distrito }}</td>
                                <td>{{ institucion.descripcion_distrito }}</td>
                                <td>{{ institucion.subsistema }}</td>
                                <td>{{ institucion.servicio }}</td>
                                <td>{{ institucion.años_servicio }}</td>
                                <td>{{ institucion.nivel }}</td>
                                <td>{{ institucion.programa }}</td>
                                <td>{{ institucion.nombre_institucion }}</td>
                                <td>{{ institucion.item }}</td>
                                <td>{{ institucion.cargo }}</td>
                                <td>{{ institucion.horas }}</td>
                                <td class="acciones">
                                    <router-link 
                                        :to="{ name: 'instituciones-edit', params: { id: institucion.id } }" 
                                        class="btn btn-warning me-2">
                                        <i class="fa-solid fa-edit"></i>
                                    </router-link>
                                    <button class="btn btn-danger" @click="eliminarInstitucion(institucion.id)">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else>No hay instituciones registradas.</p>

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
</template>


<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { confirmation } from '@/functions';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`;

const instituciones = ref([]);
const cargando = ref(true);
const criterioBusqueda = ref('');
const pagina = ref(1);
const perPage = ref(10);
const paginacion = ref({});

// Obtener instituciones con paginación
const obtenerInstituciones = async (page = 1) => {
    cargando.value = true;
    try {
        const response = await axios.get(`/api/instituciones?page=${page}&per_page=${perPage.value}`);
        if (response.data.status === "success") {
            instituciones.value = response.data.data.data; // Datos de instituciones
            paginacion.value = response.data.data; // Datos de paginación
            pagina.value = response.data.data.current_page;
        } else {
            instituciones.value = [];
        }
    } catch (error) {
        console.error("Error al obtener Instituciones:", error);
        instituciones.value = [];
    } finally {
        cargando.value = false;
    }
};

// Buscar instituciones por RDA
// Buscar instituciones por RDA
const buscarInstituciones = async (page = 1) => {
    cargando.value = true;

    try {
        let url = `/api/instituciones?page=${page}&per_page=${perPage.value}`;
        
        // Si hay un criterio de búsqueda, agregarlo a la URL
        if (criterioBusqueda.value.trim()) {
            url += `&rda=${criterioBusqueda.value}`;
        }

        const response = await axios.get(url);

        if (response.data.status === "success") {
            instituciones.value = response.data.data.data;
            paginacion.value = response.data.data; // Mantener paginación
            pagina.value = response.data.data.current_page;
        } else {
            instituciones.value = [];
        }
    } catch (error) {
        console.error("Error al buscar Instituciones:", error);
        instituciones.value = [];
    } finally {
        cargando.value = false;
    }
};

// Eliminar institución
const eliminarInstitucion = async (id) => {
    const confirmar = await confirmation("¿Estás seguro de eliminar esta institución?");
    if (confirmar) {
        try {
            await axios.delete(`/api/instituciones/${id}`);
            obtenerInstituciones();
        } catch (error) {
            console.error("Error al eliminar institución:", error);
        }
    }
};

// Cambiar de página
const cambiarPagina = (paginaNueva) => {
    if (paginaNueva > 0 && paginaNueva <= paginacion.value.last_page) {
        buscarInstituciones(paginaNueva); // Ahora usa buscarInstituciones en vez de obtenerInstituciones
    }
};

// Cargar instituciones al montar el componente
onMounted(() => buscarInstituciones());

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
