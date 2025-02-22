<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-lg w-100" style="max-width: 900px;">
        <h2 class="text-center mb-4">Agregar Nueva Institución</h2>
        
        <form @submit.prevent="save" class="row g-3">
          <div class="col-md-3">
            <label class="form-label">RDA</label>
            <input v-model="form.rda" type="text" class="form-control" required autofocus>
          </div>
          <div class="col-md-3">
            <label class="form-label">Código Distrito</label>
            <input v-model="form.codigo_distrito" type="text" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Descripción Distrito</label>
            <input v-model="form.descripcion_distrito" type="text" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Subsistema</label>
            <input v-model="form.subsistema" type="text" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Servicio</label>
            <input v-model="form.servicio" type="number" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Años de Servicio</label>
            <input v-model="form.años_servicio" type="number" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Nivel</label>
            <input v-model="form.nivel" type="text" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Programa</label>
            <input v-model="form.programa" type="text" class="form-control" required>
          </div>
          <div class="col-md-12">
            <label class="form-label">Nombre de la Institución</label>
            <input v-model="form.nombre_institucion" type="text" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Item</label>
            <input v-model="form.item" type="number" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Cargo</label>
            <input v-model="form.cargo" type="text" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Horas</label>
            <input v-model="form.horas" type="number" class="form-control" required>
          </div>
          <div class="col-12 d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="cancel">
              <i class="fa-solid fa-xmark"></i> Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-floppy-disk"></i> Guardar Institución
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { sendRequest } from '@/functions';
  
  const router = useRouter();
  
  const form = ref({
    rda: '',
    codigo_distrito: '',
    descripcion_distrito: '',
    subsistema: '',
    servicio: '',
    años_servicio: '',
    nivel: '',
    programa: '',
    nombre_institucion: '',
    item: '',
    cargo: '',
    horas: ''
  });
  
  const save = async () => {
    try {
      await sendRequest('POST', form.value, '/api/instituciones', '');
      alert('Institución creada con éxito.');
      Object.keys(form.value).forEach((key) => (form.value[key] = ''));
      await nextTick();
      router.push('/instituciones');
    } catch (error) {
      console.error('Error al guardar institución', error);
    }
  };
  
  const cancel = () => {
    router.push('/instituciones');
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
