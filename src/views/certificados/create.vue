<template>
  <div class="container mt-5">
    <h2>Agregar Firmas Digitales</h2>

    <!-- Vista previa del certificado -->
    <div v-if="imagenCertificado" class="mb-4 text-center">
      <h4>Certificado Seleccionado:</h4>
      <img :src="imagenCertificado" alt="Certificado" class="img-fluid shadow-lg" style="max-height: 400px; border: 1px solid #ccc; border-radius: 10px;" />
    </div>

    <form @submit.prevent="crearFirmas">
      <!-- Seleccionar certificado -->
      <div class="mb-3">
        <label class="form-label">Seleccionar Certificado:</label>
        <select v-model="firma.certificado_id" class="form-select" @change="actualizarMaxFirmas" required>
          <option v-for="certificado in certificados" :key="certificado.id" :value="certificado.id">
            {{ certificado.curso.nombre }} - {{ certificado.usuario.nombre }} (Máx: {{ certificado.max_firmas }} firmas)
          </option>
        </select>
      </div>

      <!-- Subir imágenes -->
      <div class="mb-3">
        <label class="form-label">Subir Firmas (Imágenes PNG/JPG) - Máximo {{ maxFirmas }}:</label>
        <input
          type="file"
          class="form-control"
          accept="image/png, image/jpeg"
          multiple
          @change="seleccionarArchivos"
        />
      </div>

      <!-- Vista previa de imágenes -->
      <div v-if="firma.archivos_firma.length > 0" class="mb-3">
        <h4>Vista previa de firmas:</h4>
        <div class="d-flex flex-wrap">
          <div v-for="(archivo, index) in firma.archivos_firma" :key="index" class="me-3 mb-3">
            <img :src="archivo.preview" alt="Vista previa" class="img-thumbnail" style="max-width: 150px;" />
            <p>{{ archivo.name }}</p>
          </div>
        </div>
      </div>

      <!-- Botón de envío -->
      <button type="submit" class="btn btn-primary" :disabled="firma.archivos_firma.length === 0">
        Agregar Firmas
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      certificados: [],
      firma: {
        certificado_id: '',
        archivos_firma: [],
      },
      maxFirmas: 4,
      imagenCertificado: '', // Guardar la URL de la imagen del certificado
    };
  },
  methods: {
    async obtenerCertificados() {
      try {
        const response = await axios.get('/api/certificados');
        this.certificados = response.data.data;
      } catch (error) {
        console.error('Error al obtener certificados:', error);
      }
    },

    actualizarMaxFirmas() {
      const certificadoSeleccionado = this.certificados.find(
        (cert) => cert.id === this.firma.certificado_id
      );
      
      if (certificadoSeleccionado) {
        this.maxFirmas = certificadoSeleccionado.max_firmas;
        this.imagenCertificado = certificadoSeleccionado.imagen_certificado_url;
      } else {
        this.maxFirmas = 4;
        this.imagenCertificado = '';
      }
    },

    seleccionarArchivos(event) {
      const archivos = Array.from(event.target.files);
      
      if (archivos.length > this.maxFirmas) {
        alert(`Este certificado solo permite subir hasta ${this.maxFirmas} firmas.`);
        return;
      }

      this.firma.archivos_firma = archivos.map((archivo) => ({
        file: archivo,
        name: archivo.name,
        preview: URL.createObjectURL(archivo),
      }));
    },

    async crearFirmas() {
      if (this.firma.archivos_firma.length === 0) {
        alert('Debes subir al menos una firma.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('certificado_id', this.firma.certificado_id);
        this.firma.archivos_firma.forEach((archivo, index) => {
          formData.append(`archivos_firma[${index}]`, archivo.file);
        });

        await axios.post('/api/firmas-digitales/lote', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('Firmas digitales agregadas con éxito.');
        this.$router.push('/certificados');
      } catch (error) {
        console.error('Error al crear firmas digitales:', error);
      }
    },
  },
  mounted() {
    this.obtenerCertificados();
  },
};
</script>

<style scoped>
.img-thumbnail {
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>

