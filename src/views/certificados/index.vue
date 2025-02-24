<template>
    <div class="container mt-4">
      <h2 class="mb-4">Certificados y Firmas Digitales</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Certificado</th>
            <th>Firmas Digitales</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(certificado, index) in certificados" :key="certificado.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="certificado.imagen_certificado" alt="Imagen del Certificado" class="img-thumbnail" width="200" />
            </td>
            <td>
              <ul v-if="certificado.firmas_digitales.length">
                <li v-for="firma in certificado.firmas_digitales" :key="firma.id">
                  <a :href="firma.archivo_firma" target="_blank">Ver firma</a>
                </li>
              </ul>
              <span v-else>No hay firmas</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        certificados: []
      };
    },
    mounted() {
      this.obtenerCertificados();
    },
    methods: {
      async obtenerCertificados() {
        try {
          const response = await axios.get('/api/certificados');
          this.certificados = response.data.data;
        } catch (error) {
          console.error('Error al obtener certificados:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .img-thumbnail {
    max-height: 150px;
    object-fit: contain;
  }
  </style>
  