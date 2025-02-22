<template>
    <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
            <div class="card border border-success">
                <div class="card-header bg-success border border-success text-white">Iniciar Sesión</div>
                <div class="card-body">
                    <form @submit.prevent="authStore.login(form)">
                        <div class="form-group">
                            <label for="carnet"><i class="fas fa-id-card"></i> Carnet</label>
                            <input type="text" id="carnet" class="form-control" v-model="form.carnet" required>
                        </div>
                        <div class="form-group">
                            <label for="password"><i class="fas fa-lock"></i> Contraseña</label>
                            <input type="password" id="password" class="form-control" v-model="form.password" required>
                        </div>
                        <button type="submit" class="btn btn-danger mt-3 w-100">Iniciar Sesión</button>
                        <router-link :to="{ path: 'register' }">Register</router-link>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const form = ref({carnet: '', password: ''});
</script>