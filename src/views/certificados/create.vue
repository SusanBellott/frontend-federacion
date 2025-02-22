<template>
    <div>
      <h2>Emisión de Certificados</h2>
      <button @click="generarCertificados" class="btn btn-success">Generar Certificados y Códigos QR</button>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Curso</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="certificado in certificados" :key="certificado.id">
            <td>{{ certificado.id }}</td>
            <td>{{ certificado.usuario.nombre }}</td>
            <td>{{ certificado.curso.nombre }}</td>
            <td><img :src="`/storage/${certificado.codigo_qr}`" alt="QR"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const certificados = ref([]);
  
  const obtenerCertificados = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8000/api/certificados');
      certificados.value = respuesta.data;
    } catch (error) {
      console.error(error);
    }
  };
  
  const generarCertificados = async () => {
    try {
      await axios.post('http://localhost:8000/api/certificados/generar-masivo');
      obtenerCertificados();
    } catch (error) {
      console.error(error);
    }
  };
  
  onMounted(() => {
    obtenerCertificados();
  });
  </script>
  