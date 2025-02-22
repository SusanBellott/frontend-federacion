<template>
    <div>
      <h2>Gestión de Inscripciones</h2>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inscripcion in inscripciones" :key="inscripcion.id">
            <td>{{ inscripcion.id }}</td>
            <td>{{ inscripcion.usuario.nombre }}</td>
            <td>{{ inscripcion.curso.nombre }}</td>
            <td>
              <button @click="editarInscripcion(inscripcion)" class="btn btn-primary">Editar</button>
              <button @click="eliminarInscripcion(inscripcion.id)" class="btn btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const inscripciones = ref([]);
  
  const obtenerInscripciones = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8000/api/inscripciones');
      inscripciones.value = respuesta.data;
    } catch (error) {
      console.error(error);
    }
  };
  
  const eliminarInscripcion = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/inscripciones/${id}`);
      obtenerInscripciones();
    } catch (error) {
      console.error(error);
    }
  };
  
  onMounted(() => {
    obtenerInscripciones();
  });
  </script>
  