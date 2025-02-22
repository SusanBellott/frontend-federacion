<template>
    <div class="container mt-4">
        <!-- Barra superior (Botón y buscador) -->
        <div class="row align-items-center mb-3">
            <div class="col-md-6 mb-2 mb-md-0">
                <router-link :to="{ name: 'usuarios-create' }" class="btn btn-dark w-100 w-md-auto">
                    <i class="fa-solid fa-circle-plus"></i> Agregar Usuario
                </router-link>
            </div>
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                    <input 
                        type="text" 
                        class="form-control" 
                        v-model="criterioBusqueda" 
                        placeholder="Buscar por carnet..." 
                        @input="buscarUsuarios"
                    />
                    <button class="btn btn-outline-success" type="button" @click="buscarUsuarios">Buscar</button>
                </div>
            </div>
        </div>

        <!-- Tabla de usuarios -->
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
                                <th>Carnet</th>
                                <th>Primer Nombre</th>
                                <th>Segundo Nombre</th>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>Rol</th>
                                <th>rda</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
                                <td>{{ (index + 1) + (pagina - 1) * perPage }}</td>
                                <td>{{ usuario.carnet }}</td>
                                <td>{{ usuario.primer_nombre }} </td>
                                <td>{{ usuario.segundo_nombre || '-' }} </td>
                                <td>{{ usuario.apellido_paterno || '-' }}</td>
                                <td>{{ usuario.apellido_materno || '-' }}</td>
                                <td>{{ usuario.rol }}</td>
                                <td>{{ usuario.institucion ? usuario.institucion.rda : 'N/A' }}</td>
                                <td class="acciones">
                                    <router-link 
                                        :to="{ name: 'usuarios-edit', params: { carnet: usuario.carnet } }" 
                                        class="btn btn-warning me-2">
                                        <i class="fa-solid fa-edit"></i>
                                    </router-link>
                                    <button class="btn btn-danger" @click="eliminarUsuario(usuario.id)">
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

const usuarios = ref([]);
const cargando = ref(false);
const criterioBusqueda = ref('');
const pagina = ref(1);
const perPage = 10;
const paginacion = ref({});

// Obtener usuarios con paginación
const obtenerUsuarios = async (page = 1) => {
    cargando.value = false;
    try {
        const response = await axios.get(`/api/usuarios?page=${page}&per_page=${perPage}`);
        usuarios.value = response.data.data;
        paginacion.value = response.data;
        pagina.value = response.data.current_page;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    } finally {
        cargando.value = true;
    }
};

// Buscar usuario por carnet
const buscarUsuarios = async () => {
    if (!criterioBusqueda.value.trim()) {
        obtenerUsuarios();
        return;
    }

    try {
        const response = await axios.get(`/api/usuarios/carnet/${criterioBusqueda.value}`);
        usuarios.value = response.data.data ? [response.data.data] : [];
    } catch (error) {
        console.error("Usuario no encontrado", error);
        usuarios.value = [];
    }
};

// Cambiar de página
const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > paginacion.value.last_page) return;
    obtenerUsuarios(nuevaPagina);
};

// Eliminar usuario
const eliminarUsuario = (id) => {
    confirmation("¿Estás seguro de eliminar este usuario?", `/api/usuarios/${id}`, '/usuarios');
};

// Cargar usuarios al montar el componente
onMounted(() => obtenerUsuarios());

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
